var static = require('node-static');
var http = require('http');
var file = new(static.Server)();
var app = http.createServer(function (req, res) {
  file.serve(req, res);

}).listen(8888);


var io = require('socket.io').listen(app);
io.sockets.on('connection', function (socket){

	function log(){
		var array = [">>> Message from server: "];
	  for (var i = 0; i < arguments.length; i++) {
	  	array.push(arguments[i]);
	  }
	    socket.emit('log', array);
	}

	socket.on('message', function (message) {
		log('Got message: ', message);
    // For a real app, should be room only (not broadcast)
		socket.broadcast.emit('message', message);
	});

	socket.on('create or join', function (room) {
		var numClients = io.sockets.clients(room).length;

		log('Room ' + room + ' has ' + numClients + ' client(s)');
		log('Request to create or join room', room);

		if (numClients == 0){
			socket.join(room);
			socket.emit('created', room);
		} else if (numClients == 1) {
			io.sockets.in(room).emit('join', room);
			socket.join(room);
			socket.emit('joined', room);
		} else { // max two clients
			socket.emit('full', room);
		}

// /////////////////////chatchat

//     socket.on('addUser', function(username){
//         // we store the username in the socket session for this client
//         socket.username = username;
//         //store user in usernameArray
//         usernameArray[username] = username;
//         //echo to the client they are connected
//         socket.emit('updateChat', 'SERVER', 'you have connected');

//         socket.broadcast.emit('updateChat', 'SERVER', username + ' has connected');

//         io.sockets.emit('updateUser', usernameArray);

//     });

//     socket.on('sendChat', function(data){
//         io.sockets.emit('updateChat', socket.username, data);
//     });

//     socket.on('disconnect', function(){
//         delete usernameArray[socket.username];
//         io.sockets.emit('updateUser', usernameArray);
//         socket.broadcast.emit('updateChat', 'SERVER', socket.username + ' has disconnected...');
//     });

// /////////////////////////chatchat


		socket.emit('emit(): client ' + socket.id + ' joined room ' + room);
		socket.broadcast.emit('broadcast(): client ' + socket.id + ' joined room ' + room);

	});

});

