/**
 * Module dependencies.
 */
var express = require('express');
var routes = require('./routes/index.js');
var user = require('./routes/user.js');
var rooms = require('./routes/rooms.js');
var http = require('http');
var path = require('path');
var app = express();
var passport = require('passport');
// var session = require('express-session');
// var RedisStore = require('connect-redis')(session);


// var mysql = require('mysql');



// var connection = mysql.createConnection({
// 	host: 'localhost',
// 	user: 'root',
// 	password: 'root'
// });


// connection.connect(function (error) {
// 	if (error) {
// 		console.log('error message: ' + error);
// 	} else{
// 		console.log('connected sucessfully!');
// 		connection.query('use test;', function (error, results) {
// 			console.log(results);
// 		});
		
			
// 	}
// });
var configDB = require('./config/database.js');
configDB.db();




// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.cookieParser());
app.use(express.session({
	
	secret: "this is a secret",
	cookie: {
		maxAge: new Date(Date.now() + 1000*60*10)
	}	
}));

app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.login);
app.get('/rooms', rooms.list);
app.get('/addRoom', rooms.addRoom);
app.get('/rooms/videochat/:roomName', function (req, res) {
	res.render('videochat', {roomName: req.params.roomName});
});
app.post('/rooms/createRoom', rooms.createRoom);


var server = http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

var io = require('socket.io').listen(server);

var userList = {};

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

		if (numClients === 0){
			socket.join(room);
			socket.emit('created', room);
		} else if (numClients === 1 ) {
			io.sockets.in(room).emit('join', room);
			socket.join(room);
			socket.emit('joined', room);
		} else { // max two clients
			socket.emit('full', room);
			
		}

	socket.emit('emit(): client ' + socket.id + ' joined room ' + room);
	socket.broadcast.emit('broadcast(): client ' + socket.id + ' joined room ' + room);

	});


	

	socket.on('addUser', function(username){
          // we store the username in the socket session for this client
        socket.username = username;
        //store user in userList
        userList[username] = username;
        //echo to the client they are connected
        socket.emit('updateChat', 'SERVER', 'you have connected');

        socket.broadcast.emit('updateChat', 'SERVER', username + ' has connected');

        log("obj" + JSON.stringify(userList));

        io.sockets.emit('updateUser', userList);

        
      
    });

	socket.on('sendChat', function(data){
         io.sockets.emit('updateChat', socket.username, data);
     });



	socket.on('disconnect', function(){
        delete userList[socket.username];
        io.sockets.emit('updateUser', userList);
        socket.broadcast.emit('updateChat', 'SERVER', socket.username + ' has disconnected...');
    });


	
});

function objectSize(the_object) {
  /* function to validate the existence of each key in the object to get the number of valid keys. */
  var object_size = 0;
  for (var key in the_object){
    if (the_object.hasOwnProperty(key)) {
      object_size++;
    }
  }
  return object_size;
}
