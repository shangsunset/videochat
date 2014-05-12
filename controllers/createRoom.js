// var Room = require('../models/room.js')();
var Room = require('../models/database').Room

exports.create = function (req, res) {
	
	
	Room
		.create({
			room_name: req.body.roomName,
			user_created: req.user.user_id
		})
		.complete(function () {
						
			Room
				.find({where: {room_name: req.body.roomName}})
				.success(function (room) {


					res.redirect('rooms/videochat/' + req.body.roomName + '/' + room.room_id);
					return room;
			})

		})

};

