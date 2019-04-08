const db = require("./db.js");

function registerUser(user) {
    var query = {
      sql : "INSERT INTO user(name, mobile) VALUES (?, ?)",
      values : [user.name, user.mobile]
    };
    const dbPromise = new Promise((resolve, reject) => {
      db.executeQuery(query, (err, results, fields) => {
        if (err) {
          if(err.code == "ER_DUP_ENTRY") {
              console.log("User already registered with mobile number ", user.mobile);
              reject("User already registered with mobile number " +user.mobile);
          } else {
            console.log(err.code, err.sqlMessage);
            reject(err.code + " " +err.sqlMessage);
          }
          
        } else {
            resolve("User registered successfully");
        }
      }); 
    });
    return dbPromise;

}

module.exports.registerUser = registerUser;
