var Room = require('../model/room.js')();

exports.list = function (req, res) {

	// find multiple entries
	Room.findAll().success(function(rooms) {
  		res.render('roomsList.jade', {rooms: rooms})
	})
}