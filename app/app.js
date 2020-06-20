const DIR = __dirname;
const config = require(DIR + '/config').config[process.env.NODE_ENV||'dev'];

const helpers  = require(DIR + '/helpers').helpers;
const Notifier = require(DIR + '/../app/Notifier');
const PdfGenerator = require(DIR + '/../app/PdfGenerator');
const EventEmmiter = require('events');

let ee = new EventEmmiter();

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

expressWorker.post('/echo', function(req, res, next) {
    console.log('Hit echo post');
    console.log(req.body);
    res.json(req.body);
});

expressWorker.post('/notify', function(req, res, next) {
  console.log('Hit notify post');
  let notifier = new Notifier(config.notifier);
  let attachments = [{
    filename: 'Заявление.pdf',
    path: '/Users/weblime/www/pasqooda/api/app/userfiles/' + req.body.filename,
    contentType: 'application/pdf'
  }]
  notifier.sendEmail(config.notifier.address, 'Новая заявка на сайте от ' + helpers.convertDate(new Date(), true), helpers.prepareNotice(req.body), attachments)
  .then((result)=>{
    res.json({res:'OK', message: 'Notice sended'});
  })
  .catch((err)=>{
    console.log('Error while send notify: ', err);
    res.json({res:'ERR', message: err.message});
  })
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
        let userID = helpers.convertDate(new Date(), true, 'dashed') + '_' + randomID;
        req.body.filename = userID + '.pdf';
        dbh.collection('users').doc(userID).set(req.body)
        .then((result)=>{
            
            let pdfGenerator = new PdfGenerator({data:req.body, filename:userID});
            pdfGenerator.getCourt().then(()=>{
              pdfGenerator.generate();
              res.json({res:'OK', message: req.body});
              console.log('Response sended');
            })
            
          
        })
        .catch((err)=>{
          console.error('Error Firebase: ', err);
          res.json({res:'ERR', message:'Сервер приболел :( Мы уже в курсе проблемы и решаем ее. Попробуйте отправить данные чуть позже.' + err.message});
        })
        
      } else {
        console.error('Error Bot Detected with token');
        res.json({res: 'ERR', message:'Дружище, нейросеть думает, что ты робот. С этим ничего нельзя сделать. Напиши нам письмо, почта в контактах.'});
      }
    })
    .catch((err)=>{
      console.error('Error Google captcha service down: ', err);
      res.json({res: 'ERR', message:'Дружище, нейросеть приболела :( Без нее мы не получим твое сообщение. Попробуй отправить данные чуть позже.'});
    })
  } else {
    console.error('Error Bot Detected without token');
    res.json({res: 'ERR', message:'Дружище, нейросеть думает, что ты робот. С этим ничего нельзя сделать. Напиши нам письмо, почта в контактах.'});
  }
  
});


expressWorker.post('/webhook/checkout/yakassa/result', function(req, res, next) {
  console.log('Hit /webhook/checkout/yakassa/result post');
  console.log('Request body: ', req.body);
  res.send('ok');
});

expressWorker.get('/checkout/kassa/result', function(req, res, next) {
  console.log('Hit checkout/result get');
  console.log('Request body: ', req.body);
});


console.log('running');

expressWorker.listen(config.port, () => console.log('Express listening on:' + config.port));

