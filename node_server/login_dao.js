const db = require("./db.js");

function login(login_details) {
    var query = {
        sql : "SELECT * FROM login WHERE mobile = ? AND password = ?",
        values : [login_details.mobile, login_details.password]
    }
}