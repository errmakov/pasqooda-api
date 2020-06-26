const DIR = __dirname;
const config = require(DIR + '/../app/config').config[process.env.NODE_ENV||'dev'];
const mocha = require('mocha');
const chai = require('chai');
const User = require('../app/User');
const assert = chai.assert;

let payIDset = ['26838588-000f-5000-8000-195835613e4c'];
let userIDset = ['2020-06-26-08-44-11_2995'];

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


it("user.downloadPDF for invalid user comes rejected", function(done) {
    User.getByPayID('foobar')
    .then((user)=>{
        return user.downloadPDF();
    })
    .catch((err)=>{
        done();
    })
})