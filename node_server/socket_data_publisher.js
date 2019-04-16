var io = require("socket.io-client")

var socket = io.connect('http://localhost:3000');

socket.emit('publish', {
    
              mobile: '7767947111',
              lat: 10.00,
              lng: 20.89

})

socket.emit('publish', {
    
    mobile: '9540181912',
    lat: 30.00,
    lng: 40.89

})