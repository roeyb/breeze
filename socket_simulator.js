var io = require('socket.io-client');
var crypto = require('crypto');

var socket = io('http://localhost:3050');
socket.on('connect', function () {
   console.log("socket connected");
   broadcast();
});

function broadcast () {
  setTimeout(function () {
    socket.emit('frame', crypto.randomBytes(9));
    console.log('.');
    broadcast();
  },100);
}
