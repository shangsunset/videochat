var Room = require('../model/room.js')();






exports.create = function (req, res) {
	
	// room.id = id;
	// roomsDB[room.id] = room;
	// id = id + 1;
	// console.log("from rooms.js: " + JSON.stringify(roomsDB[room.id]));
	Room
		.create({
			room_name: req.body.roomName
		})
		.complete(function () {
						
			Room
				.find({where: {room_name: req.body.roomName}})
				.success(function (room) {

					res.redirect('rooms/videochat/' + req.body.roomName + '/' + room.room_id);
					console.log("room_id: " + room.room_id);
			})

		})

};

