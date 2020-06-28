const DIR = __dirname;
const config = require(DIR + '/config').config[process.env.NODE_ENV||'dev'];

const helpers  = require(DIR + '/helpers').helpers;
const Notifier = require(DIR + '/../app/Notifier');
const Payment = require(DIR + '/../app/Payment');
const PdfGenerator = require(DIR + '/../app/PdfGenerator');
const EventEmmiter = require('events');
const url = require('url');
const fs = require('fs');

let ee = new EventEmmiter();

let express = require('express');
let expressWorker = express();

const axios = require('axios');
const User = require('./User');

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
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  next();
  // app.options('*', (req, res) => {
  //   res.header('Access-Control-Allow-Methods', 'GET, PATCH, PUT, POST, DELETE, OPTIONS');
  //   res.send();
  // });
});
expressWorker.use(express.json());

expressWorker.get(/download/, function(req, res, next) {
  try {
    console.log('Hit download');
    let useridMatch = url.parse(req.url, true).pathname.match(/download\/(.*)\.pdf/)
    downloadFile = useridMatch[1] + '.pdf'; 
    User.getByID(useridMatch[1])
    .then((user)=>{
      if (user.body.payment.status === 'succeeded') {
        const fileSrc = fs.createReadStream(DIR + '/userfiles/' + downloadFile);
        res.writeHead(200, {
          'Content-Type': 'application/pdf',
          'Content-Disposition': 'attachment; filename=zayavlenie.pdf',
          'Content-Transfer-Encoding': 'Binary'
        });
        fileSrc.pipe(res); 
      } else {
        throw(new Error('User payment status is not succeeded'));
      }
    })
    .catch((e)=>{
      console.log('Error: ' + e.message);
      res.status(404).send('Not Found');
    })
    
  } catch(e) {
    console.log('Error: ' + e.message);
    res.status(404).send('Not Found');
  }  
});


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
    path: DIR + '/userfiles/' + req.body.filename,
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
  try {
    console.log('Hit /webhook/checkout/yakassa/result post');
    // req.body = {
    //   type: 'notification',
    //   event: 'payment.succeeded',
    //   object: {
    //     id: '2687f8df-000f-5000-8000-18a8fab0b9a5',
    //     status: 'succeeded',
    //     paid: true,
    //     amount: { value: '300.00', currency: 'RUB' },
    //     authorization_details: { rrn: '310729677386', auth_code: '676407' },
    //     captured_at: '2020-06-26T12:08:58.711Z',
    //     created_at: '2020-06-26T12:07:59.608Z',
    //     description: '???????? ?????',
    //     metadata: { scid: '1825012' },
    //     payment_method: {
    //       type: 'bank_card',
    //       id: '2687f8df-000f-5000-8000-18a8fab0b9a5',
    //       saved: false,
    //       card: {foo: 'barcard'},
    //       title: 'Bank card *4444'
    //     },
    //     receipt_registration: 'pending',
    //     recipient: { account_id: '721540', gateway_id: '1738524' },
    //     refundable: true,
    //     refunded_amount: { value: '0.00', currency: 'RUB' },
    //     test: true
    //   }
    // }
    console.log('Request body: ', req.body);
    let filename = '';
    let userEmail = '';
    if (req.body.object.status === 'succeeded') { //Если оплата успешно
      User.getByPayID(req.body.object.id) //Сходить в базу, найти платеж и обновить статус
      .then((user)=>{
        let userBody = user.body;
        filename = user.id + '.pdf';
        userEmail = user.body.registration.contact_email;
        userBody.payment.notification = req.body.object;
        userBody.payment.status = req.body.object.status;
        userBody.payment.paid = req.body.object.paid;
        return user.setBody(userBody);
      })
      .then((result)=>{
        let notifier = new Notifier(config.notifier);
        let attachments = [{
          filename: 'Заявление.pdf',
          path: DIR + '/userfiles/' + filename,
          contentType: 'application/pdf'
        }]
        notifier.sendEmail(userEmail, 'Ваше заявление готово', helpers.prepareBuyerNotice(), attachments)
        .then((result)=>{
          console.log('User noticed with pdf');
          res.json({res: 'OK'});  
        })
        .catch((e)=>{
          throw(e);
        })
      })
      .catch((e)=>{
        console.log(e)
      })
    }
    
  } catch (e) {
    console.log(e);
  }
  
});

expressWorker.post('/checkout/status', function(req, res, next) {
  console.log('Hit /checkout/status post');
  console.log('Request body: ', req.body);
  let result = {};
  let payDetails = req.body;

  payDetails.api = config.yakassa.api;
  payDetails.secret = config.yakassa.secret;
  payDetails.shopid = config.yakassa.shopid;

  let payment = new Payment(payDetails);
  payment.get(req.body.payid)
  .then((payObj)=>{
    console.log('Response on get payment status:', payObj.status);
    result = {id: payObj.id, status: payObj.status};
    console.log('Status: ', payObj.status);
    if (payObj.status === 'succeeded') {
      console.log('Status succeeded, going get User from Firebase by paid: ', req.body.payid);
      return User.getByPayID(req.body.payid);
    } else {
      result.userid = 0;
      res.json({res: 'OK', message: result});  
    }
  })
  .then((user)=>{
    console.log('User then: ', user);
    console.log('Try saying hello...');
    user.sayHello();
    result.userid = user.id;
    res.json({res: 'OK', message: result});
  })
  .catch((err)=>{
    res.json({res: 'ERR', message: err.message});
  })
});


expressWorker.post('/checkout/newpayment', function(req, res, next) {
  console.log('Hit /checkout/newpayment post');
  console.log('Request body: ', req.body);
  let payDetails = req.body;
  payDetails.value = "300.00";
  payDetails.api = config.yakassa.api;
  payDetails.secret = config.yakassa.secret;
  payDetails.shopid = config.yakassa.shopid;
  payDetails.baseUrl = config.baseUrl;

  let payment = new Payment(payDetails);
  payment.do()
  .then((response)=>{
    console.log('Response:', response);
    let notifier = new Notifier(config.notifier);
    
    notifier.sendEmail(payDetails.customerEmail, 'Заказ ждет оплаты', helpers.preparePaylinkNotice({orderID: response.id, url: response.confirmation.confirmation_url}))
    .then((result)=>{
      console.log('User noticed with paylink');
    })
    .catch((e)=>{
      throw(e);
    })
    res.json(response);
  })
  .catch((err)=>{
    res.json({res: err.message});
  })
});

console.log('running');

expressWorker.listen(config.port, () => console.log('Express listening on:' + config.port));

