var Room = require('../models/database').Room;

module.exports = function (io) {
	
	var userList = {};
	var roomId;

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
			socket.on('updateStartTime', function (roomId) {
				var date = new Date();
				log("from server: " + date)
				
								
				log('roomId:' + roomId) 
				Room
					.find({where: {room_id: roomId}})
					.complete(function (err, room) {
						if (err) console.log(err);

						room
							.updateAttributes({
								start_time: date
							})
							.success(function (st) {
								
								console.log("st now is: " + JSON.stringify(st.start_time));
							})
						log("star_time: " + room.start_time);
					})

				socket.on('disconnect', function(){

					var date = new Date();	
				
					Room
						.find({where: {room_id: roomId}})
						.complete(function (err, room) {
							if (err) console.log(err);

							room
								.updateAttributes({
									end_time: date
								})
								.success(function (et) {
									
									console.log("et now is: " + JSON.stringify(et.end_time));
								})
							
						})

					

			        delete userList[socket.username];

			        io.sockets.emit('updateUser', userList);

			        socket.broadcast.emit('updateChat', 'SERVER', socket.username + ' has disconnected...');
			        

			    });
				
			})




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

	
			        
       
	
	
});


	
	



function objectSize(obj) {
  /* function to validate the existence of each key in the object to get the number of valid keys. */
  var objSize = 0;
  for (var key in obj){
    if (obj.hasOwnProperty(key)) {
      objSize++;
    }
  }
  return objSize;
}

}

