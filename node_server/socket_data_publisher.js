var io = require("socket.io-client")

var socket = io.connect('http://localhost:3000');

socket.emit('startPublish', ['8553016002', '7767947111'])

// socket.emit('publish', {
    
//               mobile: '7767947111',
//               lat: 28.630,
//               lng: 77.364

// },  () => {
//     socket.emit('subscribe', {
//         mobile: '7767947111'
//     }, (ackData) => {
//         console.log(ackData);
//     });
// })

socket.emit('publish', {
    
    mobile: '8553016002',
    lat: 28.6417,
    lng: 77.3575

})

socket.on('7767947111', (data) => {
    console.log(data);
});

socket.emit('subscribe', {
    mobile: '7767947111'
}, (ackData) => {
    console.log(ackData);
});

// setTimeout(() => {
//     socket.emit('subscribe', {
//         mobile: '7767947111'
//     }, (ackData) => {
//         console.log(ackData);
//     });
// }, 2000);