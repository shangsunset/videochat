var roomsDB = {};
var id = 0;

exports.listRooms = function () {
	return roomsDB;
};

exports.addRooms = function (room) {
	
	room.id = id;
	roomsDB[room.id] = room;
	id = id + 1;
	console.log("from db.js: " + JSON.stringify(roomsDB[room.id]));

};

exports.getRoomById = function (id) {
	return roomsDB[id];
};