//create a room with room name
var Room = require('../models/database').Room

exports.create = function (req, res) {
	
	
	Room
		.create({
			room_name: req.body.roomName,
			user_created: req.user.user_id
		})
		.complete(function () {
			//when a room is created. find the room with its name and pass room name and room id			
			Room
				.find({where: {room_name: req.body.roomName}})
				.success(function (room) {


					res.redirect('rooms/videochat/' + req.body.roomName + '/' + room.room_id);
			})

		})

};

