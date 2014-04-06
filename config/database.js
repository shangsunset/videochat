var mysql = require('mysql');
var Sequelize = require('sequelize');
var db = new Sequelize('test', 'root', 'root', {
      dialect: "mysql", 
      port:    3306

})
 

exports.db = function(){

	db
	  .authenticate()
	  .complete(function(err) {
	    if (!!err) {
	      console.log('Unable to connect to the database:', err)
	    } else {
	      console.log('Connection has been established successfully.')
	    }
	  })



var User = require('../app/user.js')(Sequelize, db);
var ChatSession = require('../app/chat-session.js')(Sequelize, db);

User.hasMany(ChatSession);
ChatSession.belongsTo(User, {foreignKey: 'user_id'});


};


