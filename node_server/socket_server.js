const server = require("./server.js");
const io = server.getSocketIOInstance();

const publishersMap = new Map();
const connectionsMap = new Map();

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

  socket.on('connectedMobile', (mobile) => {
     connectionsMap.set(mobile, socket.id);
  });

  socket.on('startPublish', (mobile) => {
    console.log("started publishing", socket.id, mobile);
    publishersMap.set(mobile, socket.id);
    console.log(publishersMap);

  });

  socket.on('publish', function (data) {
    console.log("publish data", data);
    // room = publishersMap.get(socket.id);
    if (publishersMap.has(data.mobile)) {
      socket.broadcast.to(data.mobile).emit(data.mobile, data);
    }
  });

  socket.on('stopPublish', function (data) {
    console.log("publish data", data);
    stopPublishing(data);
  });

  socket.on('subscribe', function (data, ackFn) {
    console.log("subscribe to mobile ", data.mobile);
    if (publishersMap.get(data.mobile)) {
      console.log("socket joining room", socket.id, data.mobile);
      socket.join(data.mobile);
      ackFn({
        status: "connected"
      })
    } else {
      console.log("No room", socket.id, data.mobile);
      // socket.to(socket.id).emit(data.mobile, {
      //   mobile: 'disconnected'
      // });
      ackFn({ status: "disconnected" })
    }
  });

  socket.on('unsubscribe', function (data) {
    console.log("un-subscribe to mobile ", data.mobile);
    socket.leave(data.mobile);
  });

  socket.on('disconnect', function () {
    console.log('user disconnected: ', socket.id);
    // stopPublishing(socket);
    // io.sockets.clients(room).forEach( (socket_id) => {
    //   socket_id.leave(room);
    // });
    var mobile_key;
    for (var [key, value] of publishersMap.entries()) {
      if (value == socket.id) {
        mobile_key = key;
        console.log("mobile key", mobile_key);
        break;
      }
    }
    stopPublishing(socket, mobile_key);
    publishersMap.delete(mobile_key); //TODO : how to delete efficiently
    connectionsMap.delete()
  });

});

function stopPublishing(socket, mobile) {
  room = mobile;
  socket.broadcast.to(room).emit(room, {
    mobile: 'disconnected'
  });
  io.of('/').in(room).clients((error, clients) => {
    console.log("connected clients:", clients);
    if (clients.length > 0) {
      console.log('clients in the room: \n');
      console.log(clients);
      clients.forEach((socket_id) => {
        io.sockets.sockets[socket_id].leave(room);
      });
    }
  });
}
