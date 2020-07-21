const DIR = __dirname;
const config = require(DIR + '/../app/config').config[process.env.NODE_ENV||'dev'];
const mocha = require('mocha');
const chai = require('chai');
const User = require('../app/User');
const assert = chai.assert;

let payIDset = ['269912a3-000f-5000-a000-115d0e97b8e3'];
let userIDset = ['2020-07-09-11-26-28_3625'];
let notificationSet = {
    id: '269912a3-000f-5000-a000-115d0e97b8e3',
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
      id: '269912a3-000f-5000-a000-115d0e97b8e3',
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


it("User.search with no input param becomes resolved with empty array", function(done) {
    User.search()
    .then((result)=>{
        assert.isEmpty(result);
        done();
    })
})

it("User.search with short input param (less than 3 chars) resolved with empty array", function(done) {
    let keyword = 'fo';
    User.search(keyword)
    .then((result)=>{
        assert.isEmpty(result);
        done();
    })
})

it("User.search with non string input param  resolved with empty array", function(done) {
    let keyword = false;
    User.search(keyword)
    .then((result)=>{
        assert.isEmpty(result);
        done();
    })
})

// Firebase must contains 'Ермаков' client
it("User.search with normally param return array of object" , function(done) {
    let keyword = 'Ермаков';
    User.search(keyword)
    .then((result)=>{
        assert.isArray(result);
        //console.log(result);
        done();
    })
})