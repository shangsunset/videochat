var util = require('util');
var db = require('./../config/database.js');

exports.list = function(req, res){
	res.render('rooms', {

		title: 'Room List',
		rooms: db.listRooms()
	});

};

exports.addRoom = function (req, res) {
	res.render('addRoom');
};


exports.createRoom = function (req, res) {
	db.addRooms({roomName: req.body.roomName});
	req.session.roomName = req.body.roomName;
	res.redirect('rooms/videochat/' + req.session.roomName);
};


