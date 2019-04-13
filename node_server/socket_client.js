// https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.2.0/socket.io.dev.js.map

var io = require("socket.io-client")

var socket = io.connect('http://localhost:3000');


// socket.on('news2', function (data) {
//     console.log(data);
//     socket.emit('my other event2', { my: 'data news2' });
// });

// socket.on('location', function (data) {
//     console.log(data);
//     socket.emit('location', { lat: 10, lng: 20, mobile: '7767947111' });
    
// });

socket.emit('locationCoords', {
    mobile : '7767947111',
    lat : 10.00,
    lng : 20.00
});

socket.on('7767947111', (data) => {
    console.log("got response");
    // console.log(data);
});

socket.on('disconnect', function(){
    console.log('user disconnected');
  
})

// console.log("socket client done");

