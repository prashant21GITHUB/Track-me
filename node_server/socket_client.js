// https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.2.0/socket.io.dev.js.map

var io = require("socket.io-client")

var socket = io.connect('http://localhost:3000');
socket.on('news', function (data) {
    console.log(data);
    socket.emit('my other event', { my: 'data 2' });
});

socket.on('news2', function (data) {
    console.log(data);
    socket.emit('my other event2', { my: 'data news2' });
});


console.log("socket client done");

