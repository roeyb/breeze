var io = require('socket.io-client');

var socket = io('http://localhost:3050');
socket.on('connect', function () {
   console.log("socket connected");
  //  socket.emit('frame_xyzrgb_string', [Math.random().toString(36).substring(7), "test1","test2","test3"]);
   broadcast();
});

function broadcast () {
  setTimeout(function () {
    socket.emit('frame_xyzrgb_string', [Math.random().toString(36).substring(7), "test1","test2","test3"]);
    broadcast();
  },500);
}
