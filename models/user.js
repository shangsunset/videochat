var bcrypt = require('bcrypt');

module.exports = function (Sequelize, db) {



	return db.define('User',
	{
		user_id: {type: Sequelize.INTEGER(), allowNull: false, autoIncrement: true, primaryKey: true},
		email: {type: Sequelize.STRING, unique: true, allowNull: false, validate: { isEmail: true }},
		password: {type: Sequelize.STRING(500), allowNull: false},
		first_name: {type: Sequelize.STRING, allowNull: false},
		last_name: {type: Sequelize.STRING, allowNull: false}
	},

	{



		getterMethods: {
			user_id : function () {
		  			return this.getDataValue('user_id');
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
					this.setDataValue('email', newEmail);
			},

			password: function (newPassword) {
					this.setDataValue('password', newPassword);
			},

			first_name: function (fn) {
					this.setDataValue('first_name', fn);
			},

			last_name: function (ln) {
					this.setDataValue('last_name', ln);
			}


		},

		//custom methods. classMethods is like static method is java
		classMethods : {
				//remember to check for error .
				setPassword : function(password, callback) {
						
						return bcrypt.hash(password, bcrypt.genSaltSync(8), callback);
												
  				}

			},

		  instanceMethods: {
     
		      verifyPassword: function(password, callback) {
		      				
					     bcrypt.compare(password, this.password, callback);

					  }

			}	

	})




	db
	  .sync({ force: true })
	  .complete(function(err) {
	     if (!!err) {
	       console.log('An error occurred while create the table:', err)
	     } else {
	     	console.log('table user synced!!');




	     }
	  });


	return User;




}
