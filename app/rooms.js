// var util = require('util');
// var db = require('./../config/database.js');



var roomsDB = {};
var id = 0;


exports.list = function(req, res){
	res.render('roomsList', {

		title: 'Room List',
		rooms: listRooms()
	});

	console.log("room object " + JSON.stringify(roomsDB));

};

exports.addRoom = function (req, res) {
	res.render('addRoom');
};


exports.createARoom = function (req, res) {
	addRoomToList({roomName: req.body.roomName});

	res.redirect('rooms/videochat/' + req.body.roomName );
};

exports.deleteARoom = function (req, res) {

};


var listRooms = function () {
	return roomsDB;
};

var addRoomToList = function (room) {
	
	room.id = id;
	roomsDB[room.id] = room;
	id = id + 1;
	console.log("from rooms.js: " + JSON.stringify(roomsDB[room.id]));

};

var getRoomById = function (id) {
	return roomsDB[id];
};
