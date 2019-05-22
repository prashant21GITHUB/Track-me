const db = require("./db.js");

function login(login_details) {
    var query = {
        sql: "SELECT name FROM user WHERE mobile = ? AND password = ?",
        values: [login_details.mobile, login_details.password]
    }
    const dbPromise = new Promise((resolve, reject) => {
        db.executeQuery(query, (err, results, fields) => {
            if (err) {
                reject(err);
            } else {
                if (results.length == 1) {
                    resolve(
                        {
                            message: "Logged in successful",
                            name: results[0].name,
                            mobile: login_details.mobile
                        });
                } else if (results.length == 0) {
                    reject("Mobile number or password is not correct");
                }
            }
        });
    })
    return dbPromise;
}

function logout(mobile) {
    var query = {
        sql: "DELETE FROM fcm_tokens WHERE mobile = ?",
        values: [mobile]
    }
    const dbPromise = new Promise((resolve, reject) => {
        db.executeQuery(query, (err, results, fields) => {
            if (err) {
                reject({
                    success : false,
                    message : err.code +" "+err.message
                });
            } else {
                    resolve(
                        {
                            success : true
                        });
            }
        });
    })
    return dbPromise;
}

function addFCMToken(mobile, token) {
    let query = {
        sql: "INSERT INTO fcm_tokens (mobile, token) VALUES( ?, ?) ON DUPLICATE KEY UPDATE token = ?",
        values: [mobile, token, token]
    }
    let dbPromise = new Promise((resolve, reject) => {
        db.executeQuery(query, (err, results, fields) => {
            if (err) {
                reject(err.code + " " + err.message);
            } else {
                //In case of update for already existing key, the affected rows count is 2 but there is only one row in db
                if (results.affectedRows == 1 || results.affectedRows == 2) {
                    resolve(
                        { 
                            success: true
                        });
                } else {
                    reject({
                        success : false,
                    })
                }
            }
        });
    });
    return dbPromise;
}

module.exports.login = login;
module.exports.logout = logout;
module.exports.addFCMToken = addFCMToken;