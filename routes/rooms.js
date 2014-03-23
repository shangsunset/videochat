var util = require('util');
var db = require('./../db.js');

exports.list = function(req, res){
	res.render('rooms', {

		title: 'Room List',
		rooms: db.listRooms()
	});

};

exports.addRoom = function (req, res) {
	res.render('addRoom');
};

// exports.rooms = function (req, res) {
//  	res.render('rooms');
// };

exports.createRoom = function (req, res) {
	db.addRooms({roomName: req.body.roomName});
	res.redirect('/rooms');
};