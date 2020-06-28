const DIR = __dirname;
const dotenv = require('dotenv');
dotenv.config();

let config = {
  dev: {
    firebase: {
      credentialsPath: DIR + '/../.credentials/' + process.env.FIREBASE_CREDENTIAL_PATH,
      url: process.env.FIREBASE_URL
    },
    captcha: {
      secret: process.env.CAPTCHA_SECRET,
      serviceUrl: process.env.CAPTCHA_SERVICE_URL
    },
    notifier: {
      smtp: {
        host: process.env.NOTIFIER_SMTP_HOST,
        user: process.env.NOTIFIER_SMTP_USER,
        password: process.env.NOTIFIER_SMTP_PASSWORD,
        port: process.env.NOTIFIER_SMTP_PORT,
        from: process.env.NOTIFIER_SMTP_FROM,
      },
      address: process.env.NOTIFIER_ADDRESS
    },
    yakassa: {
      api: process.env.YAKASSA_API,
      secret: process.env.YAKASSA_SECRET,
      shopid: process.env.YAKASSA_SHOPID
    },
    baseUrl: process.env.BASE_URL,
    debug: (process.env.DEBUG||1),
    port: process.env.PORT,
    stage: 'dev'
  },

  prod:  {
    firebase: {
      credentialsPath: DIR + '/../.credentials/' + process.env.FIREBASE_CREDENTIAL_PATH,
      url: process.env.FIREBASE_URL
    },
    captcha: {
      secret: process.env.CAPTCHA_SECRET,
      serviceUrl: process.env.CAPTCHA_SERVICE_URL
    },
    notifier: {
      smtp: {
        host: process.env.NOTIFIER_SMTP_HOST,
        user: process.env.NOTIFIER_SMTP_USER,
        password: process.env.NOTIFIER_SMTP_PASSWORD,
        port: process.env.NOTIFIER_SMTP_PORT,
        from: process.env.NOTIFIER_SMTP_FROM,
      },
      address: process.env.NOTIFIER_ADDRESS
    },
    yakassa: {
      api: process.env.YAKASSA_API,
      secret: process.env.YAKASSA_SECRET,
      shopid: process.env.YAKASSA_SHOPID,
      defaultValue: "300.00"
    },
    baseUrl: process.env.BASE_URL,
    debug: (process.env.DEBUG||1),
    port: process.env.PORT,
    stage: 'prod'
  }
}


module.exports = {config}
