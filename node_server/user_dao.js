const db = require("./db.js");

function registerUser(user) {
  var query = {
    sql: "INSERT INTO user(name, mobile, password) VALUES (?, ?, ?)",
    values: [user.name, user.mobile, user.password]
  };
  const dbPromise = new Promise((resolve, reject) => {
    db.executeQuery(query, (err, results, fields) => {
      if (err) {
        if (err.code == "ER_DUP_ENTRY") {
          console.log("User already registered with mobile number ", user.mobile);
          reject("User already registered with mobile number " + user.mobile);
        } else {
          console.log(err.code, err.sqlMessage);
          reject(err.code + " " + err.sqlMessage);
        }

      } else {
        resolve("User registered successfully");
      }
    });
  });
  return dbPromise;
}

function isMobileNumberRegistered(mobile) {
  var query = {
    sql: "SELECT name FROM user WHERE mobile = ?",
    values: [mobile]
  };
  const dbPromise = new Promise((resolve, reject) => {
    db.executeQuery(query, (err, results, fields) => {
      if (err) {
        reject(err);
      } else {
        if (results.length == 1) {
          resolve({
            success: true
          });
        } else if (results.length == 0) {
          reject({
            success : false,
            message: "User is not registered"
          });
        }
      }
    });
  });
  return dbPromise;
}

module.exports.registerUser = registerUser;
module.exports.isMobileNumberRegistered = isMobileNumberRegistered;
