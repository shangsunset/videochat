// var Room = require('../models/room.js')();
var Room = require('../models/database').Room;

exports.list = function (req, res) {

	// find multiple entries
	Room.findAll().success(function(rooms) {
  		res.render('roomsList.jade', {rooms: rooms})
	})
}