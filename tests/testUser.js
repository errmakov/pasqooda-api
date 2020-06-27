const DIR = __dirname;
const config = require(DIR + '/../app/config').config[process.env.NODE_ENV||'dev'];
const mocha = require('mocha');
const chai = require('chai');
const User = require('../app/User');
const assert = chai.assert;

let payIDset = ['26838588-000f-5000-8000-195835613e4c'];
let userIDset = ['2020-06-26-08-44-11_2995'];
let notificationSet = {
    id: '2687f8df-000f-5000-8000-18a8fab0b9a5',
    status: 'succeeded',
    paid: true,
    amount: { value: '300.00', currency: 'RUB' },
    authorization_details: { rrn: '310729677386', auth_code: '676407' },
    captured_at: '2020-06-26T12:08:58.711Z',
    created_at: '2020-06-26T12:07:59.608Z',
    description: '???????? ?????',
    metadata: { scid: '1825012' },
    payment_method: {
      type: 'bank_card',
      id: '2687f8df-000f-5000-8000-18a8fab0b9a5',
      saved: false,
      card: {foo: 'barcard'},
      title: 'Bank card *4444'
    },
    receipt_registration: 'pending',
    recipient: { account_id: '721540', gateway_id: '1738524' },
    refundable: true,
    refunded_amount: { value: '0.00', currency: 'RUB' },
    test: true
  };

it("User object has database handler", function(done) {
    let user = new User({});
    User.db()
    .then((res)=>{
        assert.isObject(res);
        done();
    })
    .catch((err)=>{
        done(err);
    })
})

it("User.getByPayID() with correct payid returns object with details from firebase", function(done) {
    User.getByPayID(payIDset[0])
    .then((user)=>{
        assert.isObject(user);
        done();
    })
    .catch((err)=>{
        done(err);
    })
})

it("User.getByPayID() with incorrect comes rejected", function(done) {
    User.getByPayID('foobar')
    .then((user)=>{
        assert.isObject(user);
        done();
    })
    .catch((err)=>{
        done();
    })
})

it("User.getByID() with correct user ID returns object with details from firebase", function(done) {
    User.getByID(userIDset[0])
    .then((user)=>{
        assert.isObject(user);
        done();
    })
    .catch((err)=>{
        done(err);
    })
})

it("User.getByID() with incorrect ID comes rejected", function(done) {
    User.getByID('foobar')
    .then((user)=>{
        assert.isObject(user);
        done();
    })
    .catch((err)=>{
        done();
    })
})


it("user.setBody() return becomes resolved with new body object", function(done) {
    User.getByID(userIDset[0])
    .then((user)=>{
        let ubody = user.body;
        ubody.payment.notification = notificationSet;
        return user.setBody(ubody);
    })
    .then((body)=>{
        
        assert.isObject(body);
        done();
    })
    .catch((err)=>{
        done(err);
    })
})