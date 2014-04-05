var mysql = require('mysql');

exports.db = function(){


var connection = mysql.createConnection({
	host: 'localhost',
	database: 'test',
	user: 'root',
	password: 'root'
});


connection.connect(function (error) {
	if (error) {
		console.log('error message: ' + error);
	} else{
		console.log('connected sucessfully!');
		
		
			
	}
});

// var table_users = {
// 	username: 'shangsunset',
// 	firstname: 'Yeshen',
// 	lastname: 'Shang',
// 	password: '123',
// 	email: 'shangsunset@gmail.com'

// };

// var query = connection.query('INSERT INTO users SET ?', table_users, function(err, result) {
  
// });






};


// var roomsDB = {};
// var id = 0;

// exports.listRooms = function () {
// 	return roomsDB;
// };

// exports.addRooms = function (room) {
	
// 	room.id = id;
// 	roomsDB[room.id] = room;
// 	id = id + 1;
// 	console.log("from db.js: " + JSON.stringify(roomsDB[room.id]));

// };

// exports.getRoomById = function (id) {
// 	return roomsDB[id];
// };