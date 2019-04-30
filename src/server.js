let app = require('express')();
let http = require('http').createServer(app);
let io = require('socket.io')(http);
let gamelogic = require('./gamelogic.js')

http.listen(3001, function(){
  console.log('listening on: 3001')
});

gamelogic(io);
