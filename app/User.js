const DIR = __dirname;
const config = require(DIR + '/config').config[process.env.NODE_ENV||'dev'];
const axios = require("axios");
const cryptoJS = require("crypto-js");
const db = require(DIR + '/db');
const dbConf = {
  serviceKey: require(config.firebase.credentialsPath),
  url: config.firebase.url
};

class User {
    constructor(options) {
      this.id = (options.id) ? options.id : null;
      this.payid = (options.payid) ? options.payid : null;
      this.body = (options.body) ? options.body : null;
    }

    static db() {
      return new Promise((resolve, reject)=>{
        let dbh;
        db.initDb(dbConf,(err, res)=>{
          dbh = res;
          resolve(dbh);
        });
      });
    }

    static getByID(uid) {
      return new Promise((resolve, reject)=>{
        User.db()
        .then((dbh)=>{
          return dbh.collection('users').doc(uid).get();
        })
        .then((user)=>{
        
          
          if(user.exists) {
              let newUser = {
                id: user.id,
                payid: user.data().payment.id,
                body: user.data()
              };

              resolve(new User(newUser));  
            
          } else {
            reject(new Error('User with id ' + uid + ' is not found'));
          }   
        })
        .catch((err)=>{
          reject(err);
        })
        
      })
    }

    static getByPayID(payid) {
      return new Promise((resolve, reject)=>{
        User.db()
        .then((dbh)=>{
          return dbh.collection('users').where("payment.id","==", payid).get()
        })
        .then((user)=>{
          if(!user.empty) {
            user.forEach(item=>{
              // console.log(item.data());
              // console.log(item.id);
              let newUser = {
                id: item.id,
                payid: payid,
                body: item.data()
              };
              
              resolve(new User(newUser));  
            })
          } else {
            reject(new Error('User with payid ' + payid + 'is not found'));
          }   
        })
        .catch((err)=>{
          reject(err);
        })
        
      })
    }

    sayHello() {
      console.log('Hello world');
    }

    /**
    * Search orders by keyword
    * @param {String} keyword Keyword for search with min length = 3
    * @returns {Object} List of founded orders or false if nothing found
    */
    static search(keyword) {
      let result = Array();
      return  new Promise((resolve,reject)=>{
        let typeKeyword = typeof(keyword);

        if ((typeKeyword === 'undefined') || (typeKeyword === 'null') || (typeKeyword === 'boolean') || (typeKeyword === 'object')) resolve(result);
        
        keyword = String(keyword);

        if (keyword.length<3) {
          resolve(result);
        } else {
          User.db()
            .then((dbh)=>{
              return dbh.collection('users').where("registration.contact_name_second","==", keyword).get()
            })
            .then((user)=>{
              if(!user.empty) {
                user.forEach(item=>{
                  let userItem = item.data();
                  userItem.id = item.id;
                  result.push(userItem);
                })
                resolve(result);
              } else {
                resolve(result);
              }   
            })
            .catch((err)=>{
              reject(new Error('Users not found'));
            })
            
        }
        
      })
    }

    setBody(newbody) {
  
      return new Promise((resolve, reject)=>{
        User.db()
        .then((dbh)=>{
          return dbh.collection('users').doc(this.id).set(newbody); 
        })
        .then((result)=>{
            this.body = newbody
            resolve(this.body);
        })
        .catch((err)=>{
          reject(err);
        })
        
      })
    }

}

module.exports = User;