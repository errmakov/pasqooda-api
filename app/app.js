const DIR = __dirname;
const config = require(DIR + '/config').config[process.env.NODE_ENV||'dev'];

const helpers  = require(DIR + '/helpers').helpers;

let express = require('express');
let expressWorker = express();

const axios = require('axios');

const db = require(DIR + '/db');
const dbConf = {
  serviceKey: require(config.firebase.credentialsPath),
  url: config.firebase.url
};

let dbh;
db.initDb(dbConf,(err, res)=>{
  dbh = res;
  //console.log(dbh);
})




// respond with "hello world" when a GET request is made to the homepage

expressWorker.use('/', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
  // app.options('*', (req, res) => {
  //   res.header('Access-Control-Allow-Methods', 'GET, PATCH, PUT, POST, DELETE, OPTIONS');
  //   res.send();
  // });
});
expressWorker.use(express.json());

expressWorker.get('/', function(req, res, next) {
  res.send('hello world! This is paqooda-api');
  console.log(req.body);
});

expressWorker.post('/echo/', function(req, res, next) {
    console.log('Hit echo post');
    console.log(req.body);
    res.json(req.body);
});

expressWorker.post('/user/add', function(req, res, next) {
  console.log('Hit user/add post');
  if (req.body.recaptchaToken !== null) {
    let secret = config.captcha.secret;
    axios.post(config.captcha.serviceUrl + '?secret=' + secret + '&response=' + req.body.recaptchaToken, {}, {"Content-Type": "application/x-www-form-urlencoded charset=utf-8"})
    .then((resp)=>{
      console.log('Captcha score is: ', resp.data.score);
      if (resp.data.score > 0.3) {
        let randomID = helpers.getRandomInt(10000);
        dbh.collection('users').doc(helpers.convertDate(new Date(), true) + '_' + randomID).set(req.body)
        .then((result)=>{
            //setTimeout(()=>{
            //console.log('Emulate network issues');
            res.json({res:'OK', echo: req.body});
            console.log('Response sended');
          //}, helpers.getRandomInt(1000));
        })
        .catch((err)=>{
          console.error('Error Firebase: ', err.message);
          res.json({err:err.message});
        })
        
      } else {
        console.error('Error Bot Detected with token');
        res.json({err:'You look like bot with token'});
      }
    })
    .catch((err)=>{
      console.error('Error Google captcha service down: ', err.message);
      res.json({err:'Google captcha service down'});
    })
  } else {
    console.error('Error Bot Detected without token');
    res.json({err:'You look like bot without token'});
  }
  
});

  

console.log('running');

expressWorker.listen(8086, () => console.log('Express listening on:' + 8086));

