const DIR = __dirname;
const config = require(DIR + '/../app/config').config[process.env.NODE_ENV||'dev'];
const mocha = require('mocha');
const chai = require('chai');
const assert = chai.assert;
const Payment = require(DIR + '/../app/Payment');
let paySet = [
    {
        orderDescription: 'My Sample Order Desc',
        customerFullname: "John Foobar Doe",
        customerPhone: "+79000000000",    
    }
]
let payIDset = ['26838a11-000f-5000-a000-18dddec0a44a', '26838588-000f-5000-8000-195835613e4c'];

it("Create new payment and get non empty PAY ID in response", function(done) {
    let payDetails = paySet[0];
    
    payDetails.value = "300.00";
    payDetails.api = config.yakassa.api;
    payDetails.secret = config.yakassa.secret;
    payDetails.shopid = config.yakassa.shopid;

    let payment = new Payment(payDetails);
    payment.do()
    .then((payObj)=>{
        assert.isNotEmpty(payObj.id);
        console.log(payObj.id);
        done();
    })
    .catch((err)=>{
        done(err)
    })
})

for (let i in payIDset) {
    it("Get status of payment by valid PAY ID: " + payIDset[i], function(done) {
    
        let payDetails = paySet[0];
        payDetails.api = config.yakassa.api;
        payDetails.secret = config.yakassa.secret;
        payDetails.shopid = config.yakassa.shopid;
    
        let payment = new Payment(payDetails);
        payment.get(payIDset[1])
        .then((payObj)=>{
            assert.isNotEmpty(payObj.status);
            console.log(payObj.status);
            done();
        })
        .catch((err)=>{
            done(err)
        })
    })
}

it("Get status of payment by invalid PAY ID becomes rejected promise", function(done) {
    
    let payDetails = paySet[0];
    payDetails.api = config.yakassa.api;
    payDetails.secret = config.yakassa.secret;
    payDetails.shopid = config.yakassa.shopid;

    let payment = new Payment(payDetails);
    payment.get('foobar')
    .catch((err)=>{
        done()
    })
})