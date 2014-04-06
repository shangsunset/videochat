var bcrypt = require('bcrypt-nodejs');

module.exports = function (Sequelize, db) {


	var User = db.define('User', {
		user_id: {type: Sequelize.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true},
		username: {type: Sequelize.STRING, allowNull: false},
		email: {type: Sequelize.STRING, allowNull: false},
		password: {type: Sequelize.STRING, allowNull: false},
		first_name: {type: Sequelize.STRING, allowNull: false},
	  	last_name: {type: Sequelize.STRING, allowNull: false}
	}, 

	{
		freezeTableName: true
	},

	{

		getterMethods: {
			uid : function () {
		  			return this.getDataValue('uid');
	  		},

		  	username: function () {
		  			return this.getDataValue('username');
	  		},

	  		email: function () {
		  			return this.getDataValue('email');
	  		},

		  	password: function () {
		  			return this.getDataValue('password');
	  		},

		  	first_name: function () {
		  			return this.getDataValue('first_name');
	  		},

	  		last_name: function () {
		  			return this.getDataValue('last_name');
	  		}
		},

		setterMethods: {
			email: function (newEmail) {
					this.setDataValue('email', newEmail.toString().toLowerCase());				
			},

			password: function (newPassWord) {
					this.setDataValue('password', newPassWord.toString().toLowerCase());				
			},

			first_name: function (fn) {
					this.setDataValue('first_name', fn.toString().toLowerCase());				
			},

			last_name: function (ln) {
					this.setDataValue('last_name', ln.toString().toLowerCase());				
			},


		}

	})

	


	//insert data to table after table is created
	db
	  .sync({ force: true })
	  .complete(function(err) {
	     if (!!err) {
	       console.log('An error occurred while create the table:', err)
	     } else {
	       console.log('table ' + User.tableName + ' created!');
	       User
				.create({
					username: 'admin',
					email: 'shangsunset@gmail.com',
					password: '123',
					first_name: 'yeshen',
					last_name: 'shang'
					})
				.complete(function(err, user) {
					User
						.find({where: { user_id: 1}})
						.complete(function (err, result) {
									if (!!err) {
						      	  console.log('An error occurred while searching for result:', err)
						    } else if (!result) {
							      console.log('No result has been found.')
						    } else {
							      console.log('Hello ' + result.username + '!')
							      console.log('All attributes of result:', result.values)
						    }
						})

				})


			
	       				
	     }
	  });


	return User;




}


