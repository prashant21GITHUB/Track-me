const server = require("./server.js");
const io = server.getSocketIOInstance();

const publishersMap = new Map();
const connectionsMap = new Map();

io.on('connection', function (socket) {

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
     console.log('an user connected: ', socket.id, mobile);
     connectionsMap.set(mobile, socket.id);
  });

  socket.on('startPublish', (mobile_arr) => {
    console.log("started publishing", socket.id, mobile_arr);
    publisher = mobile_arr[0];
    publishersMap.set(publisher, socket.id);
    for(let i=1; i < mobile_arr.length; i++) {
       socket_id = connectionsMap.get(mobile_arr[i]);
       if(socket_id != undefined) {
         io.to(socket_id).emit("publisherAvailable", publisher);
         console.log("Publisher available from ", publisher, " --> ", mobile_arr[i]);
       }
    }
    console.log(publishersMap);

  });

  socket.on('publish', function (data) {
    console.log("publish data", data);
    // room = publishersMap.get(socket.id);
    if (publishersMap.has(data.mobile)) {
      //sending excluding sender
      socket.broadcast.to(data.mobile).emit(data.mobile, data);
      //sending including sender
      // io.in(data.mobile).emit(data.mobile, data);
    } //TODO: check how to handle this situation to optimize memory
  });

  socket.on('stopPublish', function (mobile) {
    console.log("stop publish data", mobile);
    clearRoom(mobile);
    publishersMap.delete(mobile);
  });

  socket.on('subscribe', function (mobile, ackFn) {
    console.log("subscribe to mobile ", mobile);
    if (publishersMap.get(mobile)) {
      console.log("socket joining room", socket.id, mobile);
      socket.join(mobile);
      ackFn({
        status: "connected"
      })
    } else {
      console.log("No room", socket.id, mobile);
      // socket.to(socket.id).emit(data.mobile, {
      //   mobile: 'disconnected'
      // });
      ackFn({ status: "disconnected" })
    }
  });

  socket.on('unsubscribe', function (mobile) {
    console.log("un-subscribe to mobile ", mobile);
    socket.leave(mobile);
  });

  socket.on('disconnect', function () {
    console.log('user disconnected: ', socket.id);
    // stopPublishing(socket);
    // io.sockets.clients(room).forEach( (socket_id) => {
    //   socket_id.leave(room);
    // });
    // var mobile_key;
    // for (var [key, value] of publishersMap.entries()) {
    //   if (value == socket.id) {
    //     mobile_key = key;
    //     console.log("mobile key", mobile_key);
    //     break;
    //   }
    // }
    // stopPublishing(socket, mobile_key);
    // publishersMap.delete(mobile_key); //TODO : how to delete efficiently
    connectionsMap.delete()
  });

});

function clearRoom(mobile) {
  room = mobile;
  socket.broadcast.to(room).emit("publisherNotAvailable", room);
  io.of('/').in(room).clients((error, clients) => {
    // console.log("connected clients:", clients);
    if (clients.length > 0) {
      console.log('connected clients in the room: ', room, clients);
      // console.log(clients);
      clients.forEach((socket_id) => {
        io.sockets.sockets[socket_id].leave(room);
      });
    }
  });
}
