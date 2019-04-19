const express = require("express");
const body_parser = require("body-parser");
const user_dao = require("./user_dao.js");
const login_dao = require("./login_dao.js");

var app = express();
var httpServer = require('http').createServer(app);
var io = require('socket.io')(httpServer);

app.use(body_parser.json()); // for parsing application/json

// Enable CORS
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get("/", (req, res) => {
    console.log("server access");
    res.send("Success");
});

//Track request
app.put("/track/request", (req, res) => {
    console.log(req.body);
    track_request = req.body;
});

app.put("/user/isregistered", (req, res) => {
    mobile = req.body.mobile;
    if (mobile == undefined ) {
        res.status(200).send({ success: false, message: "Entered mobile number is invalid !!" });
    } else {
        user_dao.isMobileNumberRegistered(mobile).then((successMessage) => {
            res.status(200).send(successMessage);
        }, (errorMessage) => {
            res.status(200).send(errorMessage);
        });
    }
});

app.put("/user/location/share", (req, res) => {
    mobile = req.body.mobile;
    contacts = req.body.contacts;
    console.log(req.body);
    if (mobile == undefined ) {
        res.status(200).send({ success: false, message: "Entered mobile number is invalid !!" });
    } else {
        user_dao.isMobileNumberRegistered(mobile).then((successMessage) => {
            res.status(200).send(successMessage);
        }, (errorMessage) => {
            res.status(200).send(errorMessage);
        });
    }
});

/**
 * req object: 
 * {
 *    name : "john smith"
 *    mobile : 9999999999,
 *    password : "xxxxxx"
 * }
 */
app.post("/user/register", (req, res) => {
    console.log(req.body);
    user_details = req.body;
    if (user_details.name == undefined || user_details.mobile == undefined || user_details.password == undefined) {
        res.status(200).send({ success: false, message: "Entered name, mobile number or password is invalid !!" });
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
app.put("/user/login", (req, res) => {
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

app.post("/track/sendLocation", (req, res) => {
    console.log(req.body);
    location_coords = req.body;
    lat = location_coords.lat;
    lng = location_coords.lng;
    mobile = location_coords.mobile;
    
    
});

function startServer(port, host) {
    httpServer.listen(port, host);
}

function getSocketIOInstance() {
    return io;
}

module.exports.startServer = startServer;
module.exports.getSocketIOInstance = getSocketIOInstance;