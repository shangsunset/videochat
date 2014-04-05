var bcrypt = require('bcrypt-nodejs');

module.exports = function (Sequelize, db) {

	var User = db.define('User', {
	  username: Sequelize.STRING,
	  email: Sequelize.STRING,
	  password: Sequelize.STRING
	}, {
	  tableName: 'users', // this will define the table's name
	  
})


	db
	  .sync({ force: true })
	  .complete(function(err) {
	     if (!!err) {
	       console.log('An error occurred while create the table:', err)
	     } else {
	       console.log('It worked!')
	     }
	  })
}


