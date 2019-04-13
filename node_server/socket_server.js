const server = require("./server.js");
const io = server.getSocketIOInstance();

io.on('connection', function (socket) {
    console.log('an user connected: ', socket.id);
    
    socket.on('locationCoords', function (data){
        console.log(data);
        socket.broadcast.emit('message', {
          mobile: '7767947111',
          lat: 10.00,
          lng: 20.89
        });
        // socket.send("ok");
        // socket.emit(data.mobile, data);
    });
    
    socket.on('disconnect', function(){
      console.log('user disconnected: ', socket.id);
    });
 
});
io.emit("hi");