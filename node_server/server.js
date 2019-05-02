const express = require("express");
const body_parser = require("body-parser");
const user_dao = require("./user_dao.js");
const login_dao = require("./login_dao.js");
const user_data = require("./users_graph.js");
const socket = require("./socket_server.js");

const logger = require("./logger.js");
const app = express();
const httpServer = require('http').createServer(app);
const io = require('socket.io')(httpServer);

var fnId = 1;
app.use(body_parser.json()); // for parsing application/json

// Enable CORS
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get("/", (req, res) => {
    logger.info("request /")
    res.send("Success");
});

app.put("/user/isregistered", (req, res) => {
    mobile = req.body.mobile;
    //TODO: do not trace password
    fId = fnId;
    logger.info("ReqId:" + fId + "URL:/user/isregistered, Mobile:" + mobile + ", Req:" + JSON.stringify(req.body));
    if (mobile == undefined) {
        res.status(200).send({ success: false, message: "Entered mobile number is invalid !!" });
    } else {
        user_dao.isMobileNumberRegistered(mobile).then((successMessage) => {
            res.status(200).send(successMessage);
        }, (errorMessage) => {
            res.status(200).send(errorMessage);
        });
    }
});

app.put("/user/track/details", (req, res) => {
    mobile = req.body.mobile;
    logger.info("URL:/user/track/details, Mobile:" + mobile + ", Req:" + JSON.stringify(req.body));

    if (mobile == undefined) {
        res.status(200).send({ success: false, message: "Entered mobile number is invalid !!" });
    } else {
        user_dao.getTrackingDetails(mobile).then((tracking_details) => {
                res.status(200).send({
                    success: true,
                    sharingWith: tracking_details.sharingWith,
                    tracking: tracking_details.tracking
                })
        }, (error) => {
            res.status(200).send({ success: false, message: error });
        });
    }
});

// app.put("/user/location/share", (req, res) => {
//     // console.log("Body: ", req.body);
//     mobile = req.body.mobile;
//     logger.info("URL:/user/location/share, Mobile:" +mobile +", Req:" + JSON.stringify(req.body));
//     contacts = req.body.contacts;
//     // console.log(contacts, typeof contacts);
//     if (mobile == undefined ) {
//         res.status(200).send({ success: false, message: "Entered mobile number is invalid !!" });
//     } else if(contacts == undefined || contacts.length == 0) {
//         res.status(200).send({ success: false, message: "Empty contact list !!" });
//     } 
//     else {
//         user_data.addUser(mobile, contacts);
//         res.status(200).send({
//             success : true
//         })
//     }
// });

app.post("/user/location/share/addcontact", (req, res) => {
    // console.log("Body: ", req.body);
    from_mobile = req.body.from_mobile;
    to_mobile = req.body.to_mobile;
    to_name = req.body.to_name;
    logger.info("URL:/user/location/share/addcontact, From Mobile:" + from_mobile + ", To Mobile:" + to_mobile + ", To Name:" + to_name);
    // console.log(contacts, typeof contacts);
    if (from_mobile == undefined || to_mobile == undefined || to_name == undefined) {
        res.status(200).send({ success: false, message: "Entered mobile number is invalid !!" });
    }
    else {
        user_dao.addContactToShareLocation(from_mobile, to_mobile, to_name)
            .then((successMessage) => {
                res.status(200).send(successMessage);
            }, (errorMessage) => {
                res.status(200).send({
                    success: false,
                    message: errorMessage
                });
            });
    }
});

app.post("/user/location/share/deletecontact", (req, res) => {
    // console.log("Body: ", req.body);
    from_mobile = req.body.from_mobile;
    to_mobile = req.body.to_mobile;

    logger.info("URL:/user/location/share/deletecontact, From Mobile:" + from_mobile + ", To Mobile:" + to_mobile);
    // console.log(contacts, typeof contacts);
    if (from_mobile == undefined || to_mobile == undefined) {
        res.status(200).send({ success: false, message: "Entered mobile number is invalid !!" });
    }
    else {
        user_dao.deleteContactToShareLocation(from_mobile, to_mobile)
            .then((successMessage) => {
                socket.removeContactFromRoom(to_mobile, from_mobile);
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
    logger.info("URL:/user/register, Mobile:" + req.body.mobile + ", Req:" + JSON.stringify(req.body));
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
    logger.info("URL:/user/login, Mobile:" + req.body.mobile + ", Req:" + JSON.stringify(req.body));
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
    httpServer.listen(port, host);
}

function getSocketIOInstance() {
    return io;
}

module.exports.startServer = startServer;
module.exports.getSocketIOInstance = getSocketIOInstance;