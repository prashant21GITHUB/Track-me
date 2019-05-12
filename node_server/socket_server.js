const server = require("./server.js");
const io = server.getSocketIOInstance();
const logger = require("./logger.js");

const publishersMap = new Map();
const connectionsMap = new Map();
const lastLocationData = new Map();
const socketToPublisherMap = new Map();

io.on('connection', function (socket) {
  logger.info("on:connection, Socket:" + socket.id);
  socket.on('connectedMobile', (mobile) => {
    logger.info("on:connectedMobile, Mobile:" + mobile + ", Socket:" + socket.id);
    connectionsMap.set(mobile, socket.id);
  });

  socket.on('startPublish', (mobile_arr) => {

    publisher = mobile_arr[0];
    logger.info("on:startPublish, Mobile:" + publisher + ", Subscribers:" + mobile_arr.slice(1));
    publishersMap.set(publisher, socket.id);
    socketToPublisherMap.set(socket.id, publisher);
    for (let i = 1; i < mobile_arr.length; i++) {
      socket_id = connectionsMap.get(mobile_arr[i]);
      if (socket_id != undefined) {
        io.to(socket_id).emit("publisherAvailable", publisher);
        logger.info("emit:publisherAvailable, To:" + mobile_arr[i] + ", Socket:" + socket_id + ", Publisher:" + publisher);
      }
    }

  });

  socket.on('publish', function (data) {
    // room = publishersMap.get(socket.id);
    if (publishersMap.has(data.mobile)) {
      //sending excluding sender
      logger.info("on:publish, data:" + JSON.stringify(data));
      socket.broadcast.to(data.mobile).emit(data.mobile, data);
      lastLocationData.set(data.mobile, data);
      //sending including sender
      // io.in(data.mobile).emit(data.mobile, data);
    } //TODO: check how to handle this situation to optimize memory
  });

  socket.on('stopPublish', function (mobile) {
    logger.info("on:stopPublish, Mobile:" + mobile);
    clearRoom(socket, mobile);
    publishersMap.delete(mobile);
    socketToPublisherMap.delete(socket.id);
  });

  socket.on('notLive', function (mobile) {
    logger.info("on:notLive, Mobile:" + mobile);
    logger.info("Sending not live event, room:" + mobile);
    logger.info("emit:notLive, Mobile:" + mobile);
    socket.broadcast.to(room).emit("notLive", room);
  });

  socket.on('subscribe', function (mobile, ackFn) {
    const lastLocation = lastLocationData.get(mobile);
    if (publishersMap.has(mobile)) {
      logger.info("on:subscribe, joining room:" + mobile + ", Socket:" + socket.id);
      socket.join(mobile);
      ackFn({
        status: "connected",
        lastLocation: lastLocation
      })
    } else {
      logger.info("on:subscribe, No room:" + mobile + ", Socket:" + socket.id);
      // socket.to(socket.id).emit(data.mobile, {
      //   mobile: 'disconnected'
      // });
      ackFn({
        status: "disconnected",
        lastLocation: lastLocation
      }
      )
    }
  });

  socket.on('unsubscribe', function (mobile, ackFn) {
    logger.info("on:unsubscribe, Leaving room:" + mobile + ", Socket:" + socket.id);
    socket.leave(mobile);
    ackFn({
      status: "success"
    }
    )
  });

  socket.on('removeContact', function (data) {
    contact_to_remove = data.contactToRemove;
    room = data.publisher;
    socket_id = connectionsMap.get(contact_to_remove);
    if (socket_id != undefined) {
      io.to(socket_id).emit("publisherNotAvailable", room);
      if(io.sockets.sockets[socket_id] != undefined) {
        io.sockets.sockets[socket_id].leave(room);
      }
      logger.info("on:removeContact, Remove contact" + contact_to_remove + ", Publisher:" + room);
    } else {
      logger.info("on:removeContact, No socket connection for contact to be removed, ContactToRemove: " + contact_to_remove + ", Publisher:" + room);
    }

  });

  socket.on('addContact', function (data) {
    contact_to_add = data.contactToAdd;
    room = data.publisher;
    socket_id = connectionsMap.get(contact_to_add);
    if (socket_id != undefined) {
      io.to(socket_id).emit("publisherAvailable", room);
      logger.info("on:addContact, Add contact" + contact_to_add + ", Publisher:" + room);
    } else {
      logger.info("on:addContact, No socket connection for contact to be added, ContactToAdd: " + contact_to_add + ", Publisher:" + room);
    }

  });

  socket.on('disconnect', function () {
    logger.info("on:disconnect, Socket:" + socket.id);
    // connectionsMap.delete()
    if(socketToPublisherMap.has(socket.id)) {
      let mobile = socketToPublisherMap.get(socket.id);
      logger.info("Sending not live event due to disconnect, room:" + mobile);
      logger.info("emit:notLive, Mobile:" + mobile);
      io.to(mobile).emit("notLive", mobile);
    }
  });

});

function clearRoom(socket, mobile) {
  room = mobile;
  logger.info("Clear room:" + mobile);
  logger.info("emit:publisherNotAvailable, Mobile:" + mobile);
  socket.broadcast.to(room).emit("publisherNotAvailable", room);
  io.of('/').in(room).clients((error, clients) => {
    // console.log("connected clients:", clients);
    if (clients.length > 0) {
      logger.info("connected clients - room:" + room + ", clients:" + clients);
      // console.log(clients);
      clients.forEach((socket_id) => {
        logger.info("Socket leaving room - room:" + room + ", socket:" + socket_id);
        io.sockets.sockets[socket_id].leave(room);
      });
    }
  });
}
