const express = require("express");
const body_parser = require("body-parser");

var server = express();

server.use(body_parser.json()); // for parsing application/json

// Enable CORS
server.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

server.get("/", (req, res) => {
    res.send("Success");
});

server.post("/user/register", (req, res) => {
    console.log(req.body);
    res.send("New user registered");
});

function startServer(port, host) {
    server.listen(port, host);
}

module.exports.startServer = startServer;