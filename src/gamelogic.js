module.exports = function gamelogic(io){
  let players = [];
  let turn = 0;
  io.on('connection', function(socket){
    console.log('Client connected');
    if (players.length >= 2 )
      return;
    players.push(socket);
    socket.on("Press button", function(data){
      console.log('Received button press', data)
      if (players.indexOf(socket) == turn){
        socket.emit('message', 'Nice, you played a turn');
        turn = (turn+1)%2
      } else {
        socket.emit('message', "It's not your turn, fool!");
      }
    })
  })
}
