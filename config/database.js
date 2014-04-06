var mysql = require('mysql');
var Sequelize = require('sequelize')
  , db = new Sequelize('test', 'root', 'root', {
      dialect: "mysql", // or 'sqlite', 'postgres', 'mariadb'
      port:    3306, // or 5432 (for postgres)
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


