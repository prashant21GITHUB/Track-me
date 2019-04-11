const express = require("express");
const body_parser = require("body-parser");
const user_dao = require("./user_dao.js");
const login_dao = require("./login_dao.js");

var server = express();

server.use(body_parser.json()); // for parsing application/json

// Enable CORS
server.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

server.get("/", (req, res) => {
    console.log("server access");
    res.send("Success");
});

/**
 * req object: 
 * {
 *    name : "john smith"
 *    mobile : 9999999999,
 *    password : "xxxxxx"
 * }
 */
server.post("/user/register", (req, res) => {
    console.log(req.body);
    user_details = req.body;
    if (user_details.name == undefined || user_details.mobile == undefined || user_details.password == undefined) {
        res.status(200).send({ success: false, message: "Enter valid name, mobile numder and password !!" });
    } else {
        user_dao.registerUser(req.body).then((successMessage) => {
            res.status(200).send({
                success: true,
                message: successMessage
            });
        }, (errorMessage) => {
            res.status(200).send({ success: false, message: errorMessage });
        });
    }
});

/**
 * req object: 
 * {
 *    mobile : 9999999999,
 *    password : "xxxxxx"
 * }
 * 
 * Note - Mobile no. length is fixed of size 10
 */
server.put("/user/login", (req, res) => {
    console.log(req.body);
    login_details = req.body;
    if (login_details.mobile == undefined || login_details.password == undefined) {
        res.status(200).send({ success: false, message: "Enter valid login details !!" });
    } else {
        login_dao.login(req.body).then((successResponse) => {
            res.status(200).send({ 
                success: true,
                 message: successResponse.message,
                 name: successResponse.name,
                 mobile: successResponse.mobile
                 });
        }, (errorMessage) => {
            res.status(200).send({ success: false, message: errorMessage });
        });
    }
});

function startServer(port, host) {
    server.listen(port, host);
}

module.exports.startServer = startServer;