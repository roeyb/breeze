var io = require('socket.io')({
transports: ['websocket'],
});

io.attach(3050);

io.on('connection', function(socket){
  socket.on('beep', function(){
  socket.emit('boop');
  });
});
