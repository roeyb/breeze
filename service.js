var app = require('http').createServer(handler),
    io = require('socket.io').listen(app);
    redis_client = require('redis').createClient();

redis_client.on('connect', function() {
    console.log('redis connected');
});

io.on('connection', function(socket) {
  console.log('socket connected');
  socket.on('frame', function (data) {
    // console.log('saving frame to redis');
    //save frame to redis
    redis_client.rpush(['frames', data], function(err, reply) {
      console.log(data);
    });
  });
});

function handler (req, res) {
  res.writeHead(200);
  res.end();
}

console.log('service up (3050)');
app.listen(3050);
