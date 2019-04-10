const db = require("./db.js");

function login(login_details) {
    var query = {
        sql : "SELECT * FROM user WHERE mobile = ? AND password = ?",
        values : [login_details.mobile, login_details.password]
    }
    const dbPromise = new Promise((resolve, reject) => {
        db.executeQuery(query, (err, results, fields) => {
            if(err) {
                reject(err);
            } else {
                if(results.length == 1) {
                    resolve("Logged in successful");
                } else if(results.length == 0){
                    reject("Mobile number or password is not correct");
                }
            }
        });    
    })
    return dbPromise;
}

module.exports.login = login;