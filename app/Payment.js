const axios = require("axios");
const cryptoJS = require("crypto-js");

class Payment {
    constructor(options) {
      this._value = options.value;
      this._orderDescription = options.orderDescription;
      this._customerFullname = options.customerFullname;
      this._customerPhone = options.customerPhone;
      this._api = options.api;
      this._secret = options.secret;
      this._shopid = options.shopid;
    }
    do() {
      return new Promise((resolve, reject)=>{
        let payObject = {
          "amount": {
            "value": this._value,
            "currency": "RUB"
          },
          "capture": true,
          "confirmation": {
            "type": "redirect",
            "return_url": "http://localhost:8082/checkout/result"
          },
          "description": this._orderDescription,
          "receipt": {
            "customer": {
              "full_name": this._customerFullname,
              "phone": this._customerPhone
            },
            "items": [
              {
                "description": "Подготовка заявления",
                "quantity": "1",
                "amount": {
                  "value": this._value,
                  "currency": "RUB"
                },
                "vat_code": "2",
                "payment_mode": "full_prepayment",
                "payment_subject": "commodity"
              }
            ]
          }
        };
        let ts = Date.now();
        let idempotence = cryptoJS.SHA256(this._orderDescription +  this._customerFullname + this._customerPhone + ts).toString();

        //console.log('idempotence: ', idempotence);
        // console.log('secret: ', this._secret);
        // console.log('shopid: ', this._shopid);
        // console.log('token: ', token);
        // console.log('value: ', this._value);
        axios.post(this._api, payObject, {
          headers: {
            "Content-Type": "application/json",
            "Idempotence-Key": idempotence
          },
          auth: {
            username: this._shopid,
            password: this._secret
          }
        })
        .then((response)=>{
          resolve(response.data);
        })
        .catch((err)=>{
          console.log('Payment.get() err: ', err);
          reject(err);
        })
        
      })
    }
    get(payid) {
      // Пример запроса https://kassa.yandex.ru/developers/api#get_payment
      return new Promise((resolve, reject)=>{
        axios.get(this._api + '/' + payid, {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
          auth: {
            username: this._shopid,
            password: this._secret
          }
        })
        .then((response)=>{
          resolve(response.data);
        })
        .catch((err)=>{
          console.log('Payment.get() err: ', err.message);
          reject(err);
        })
        
      })
    }
    
}

module.exports = Payment;