const DIR = __dirname;
const config = require(DIR + '/../app/config').config[process.env.NODE_ENV||'dev'];
const mocha = require('mocha');
const chai = require('chai');
const assert = chai.assert;
chai.use(require("chai-as-promised"));
const Notifier = require(DIR + '/../app/Notifier');

it("Send promise should becomes resolved", function() {
    let notifier = new Notifier(config.notifier);
    return assert.isFulfilled(notifier.sendEmail(config.notifier.address, 'helloworld', 'This is hello world message '))
})