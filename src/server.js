var app = require ('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http); 

app.get('/', function (req,res){
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
    let game = null;
    console.log(`User {socket.id} connected`);

    socket.on('disconnect', ex(() =>{
        
    }) 
});

http.listen(3000,function(){ 
    console.log('listening on *:3000');
});