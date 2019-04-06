const PropertiesReader = require('properties-reader');
const mysql = require('mysql');

var properties = PropertiesReader('./res/db_config.properties');

console.log(properties.get("db.host"));

var pool  = mysql.createPool({
  connectionLimit : 10,   //default value = 10
  host            : properties.get("db.host"),
  port            : properties.get("db.port"),
  user            : properties.get("db.user"),
  password        : properties.get("db.password"),
  database        : properties.get("db.name")
});

pool.getConnection((err, connection) => {
    if (err) throw err;
    connection.ping((err) => {
        connection.release();
        if (err) throw err;
        console.log('Server responded to ping');
      
    })
    
})

function registerUser(user) {
    var query = {
      sql : "INSERT INTO user(name, mobile) VALUES (?, ?)",
      values : [user.name, user.mobile]
    };
    const dbPromise = new Promise((resolve, reject) => {
      pool.query(query, (err, results, fields) => {
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
