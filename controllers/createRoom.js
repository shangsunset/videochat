// var Room = require('../models/room.js')();
var Room = require('../models/database').Room

exports.create = function (req, res) {
	
	
	Room
		.create({
			room_name: req.body.roomName
		})
		.complete(function () {
						
			Room
				.find({where: {room_name: req.body.roomName}})
				.success(function (room) {

					// if(err) console.log(err);

					res.redirect('rooms/videochat/' + req.body.roomName + '/' + room.room_id);
					
					
			})

		})

};

