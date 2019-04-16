const server = require("./server.js");
const io = server.getSocketIOInstance();

io.on('connection', function (socket) {
    console.log('an user connected: ', socket.id);
    
    // socket.on('locationCoords', function (data){
    //     console.log(data);
    //     // socket.join(data.mobile);
    //     socket.broadcast.emit('message', {
    //       mobile: '7767947111',
    //       lat: 10.00,
    //       lng: 20.89
    //     });
    //     // socket.send("ok");
    //     // socket.emit(data.mobile, data);
    // });

    socket.on('publish', function(data) {
        console.log("publish data", data);
        socket.broadcast.to(data.mobile).emit(data.mobile, data);
    });

    socket.on('subscribe', function(data) {
      console.log("subscribe to mobile ", data.mobile);
      socket.join(data.mobile);
    });

    socket.on('unsubscribe', function(data) {
      console.log("un-subscribe to mobile ", data.mobile);
      socket.leave(data.mobile);
    });
    
    socket.on('disconnect', function(){
      console.log('user disconnected: ', socket.id);
    });
    
});