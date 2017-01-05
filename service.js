var app = require('http').createServer(handler),
    io = require('socket.io').listen(app);
    redis_client = require('redis').createClient();

redis_client.on('connect', function() {
    console.log('redis connected');
});

io.on('connection', function(socket) {
  console.log('socket connected');
  // socket.on('point_xyzrgb', function (data) {
  //   // console.log('saving frame to redis');
  //   //push point to frame in redis
  //   redis_client.rpush(['frame', data], function(err, reply) {
  //     // console.log(data);
  //   });
  // });
  socket.on('point_xyzrgb_stream_strings', function (data) {
    var points = data.split(';');
    multi = redis_client.multi();
    for (var i = 0; i < points.length; i++) {
      multi.rpush(['frameStrings', points[i]], function(err, reply) {
        // console.log(data);
      });
    }
    multi.exec();
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
});

function handler (req, res) {
  res.writeHead(200);
  res.end();
}

console.log('service up (3050)');
app.listen(3050);
