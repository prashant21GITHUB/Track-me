const server = require("./server.js");
const io = server.getSocketIOInstance();

io.on('connection', function (socket) {
    socket.emit('news', { hello: 'world' });
    socket.emit('news2', { hello: 'world2' });
    socket.on('my other event', function (data) {
        console.log(data);
    });
    socket.on('my other event2', function (data) {
        console.log(data);
    });
    console.log("got socket connection");
});