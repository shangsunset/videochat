var mysql = require('mysql');
var Sequelize = require('sequelize');
var db = new Sequelize('test', 'root', 'root', {
    dialect: "mysql", 
    port: 3306

})
var User = require('./user.js')(Sequelize, db);
var Room = require('./room.js')(Sequelize, db);


module.exports = function(){

	

	db
	  .authenticate()
	  .complete(function(err) {
	    if (!!err) {
	      console.log('Unable to connect to the database:', err)
	    } else {
	      console.log('Connection has been established successfully.')
	    }
	  })

};


User.hasMany(Room);
Room.belongsTo(User, {foreignKey: 'user_id'});

