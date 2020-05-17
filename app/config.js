const DIR = __dirname;
const dotenv = require('dotenv');
dotenv.config();

let config = {
  dev: {
    firebase: {
      credentialsPath: DIR + '/../.credentials/' + process.env.FIREBASE_CREDENTIAL_PATH,
      url: process.env.FIREBASE_URL
    },
    debug: (process.env.DEBUG||1),
    captcha: {
      secret: process.env.CAPTCHA_SECRET,
      serviceUrl: process.env.CAPTCHA_SERVICE_URL
    },
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
    debug: (process.env.DEBUG||1),
    stage: 'prod'
  }
}


module.exports = {config}
