var io = require("socket.io-client")

var socket = io.connect('http://localhost:3000');

socket.emit('publish', {
    
              mobile: '7767947111',
              lat: 28.630,
              lng: 77.365

})

socket.emit('publish', {
    
    mobile: '9540181912',
    lat: 28.6206,
    lng: 77.3555

})