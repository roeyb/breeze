var app = require('http').createServer(handler),
    io = require('socket.io').listen(app);
    redis_client = require('redis').createClient();

redis_client.on('connect', function() {
    console.log('redis connected');
});

io.on('connection', function(socket) {
  // console.log('socket connected');
  console.log('connection :', socket.request.connection._peername);

  socket.on('frame_xyzrgb_string', function (data){
    multi = redis_client.multi();
    var key = "frame_xyzrgb_string_"+data[0];
    for (var i = 1; i < data.length; i++) {
      if (data[i])
        multi.rpush([key, data[i]], function(err, reply) {
        });
    }
    multi.expire([key, 600]) //expire frame after 10 minutes
    multi.exec(function(err, replies) {
      //trigger matrix calculation event for this key
      socket.broadcast.emit('perform_surface_match', JSON.parse('{"key":"'+key+'"}'));
      console.log(key);
    });
  });





  socket.on('point_xyzrgb_stream_strings', function (data) {
    console.log(data);
    if (data){
      // var points = data.split(';');
      multi = redis_client.multi();
      for (var i = 0; i < data.length; i++) {
        if (data[i])
          multi.rpush(['frameStrings', data[i]], function(err, reply) {
            // console.log(data);
          });
      }
      multi.exec();
    }
  });
  socket.on('point_xyzrgb_stream_bytes', function (data) {
    multi = redis_client.multi();
    for (var i = 15; i <= data.length; i+=15) {
      //TODO get point message and send as byte to redis
      msg = data.toString(undefined, i-15,i);
      console.log(msg);
        multi.rpush(['frameBytes', msg], function(err, reply) {
        });
    }
    multi.exec();
  });
  socket.on('result_matrix_from_pc', function (data) {
    //send result matrix to everyone except sender of this event
    console.log('result_matrix_from_pc');
    console.log(data);
    socket.broadcast.emit('result_matrix', JSON.parse('{"result_matrix":"' +data+'"}'));
    // io.emit('boop', data);
  });
  socket.on('beep', function (data) {
    console.log('beep');
    // console.log(io.sockets.clients().connected);
    socket.emit('boop', JSON.parse('{"test":1}'));
  });
  socket.on('result_matrix_test', function (data) {
    console.log('result_matrix_test');
    socket.emit('result_matrix', JSON.parse('{"result_matrix":"0.39852,-0.51066,-0.76184,0.39852,-0.51066,-0.76184,0.39852,-0.51066,-0.76184,-0.87544,-0.55377,-0.19641"}'));
  });
});

function handler (req, res) {
  res.writeHead(200);
  res.end();
}

console.log('service up (3050)');
app.listen(3050);
