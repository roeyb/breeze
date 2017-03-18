
var WebSocketServer = require('ws').Server
  , wss = new WebSocketServer({port: 3050});

var redis = require("redis"),
    client = redis.createClient();

client.on('connect', function() {
    console.log('redis connected..');
});

wss.on('connection', function(ws) {
  console.log('connection open');

  ws.on('message', function(data, flags) {

    console.log('Data Received')

    var key = "frame_xyz_binary";

    // flags.binary will be set if a binary data is received.
    if (!flags.binary) {
      key = "frame_xyz_string";
    }

    client.hset(key, Date.now(), data);
  });
});