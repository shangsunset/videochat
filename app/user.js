var bcrypt = require('bcrypt');

module.exports = function () {

	var Sequelize = require('sequelize');
	var db = new Sequelize('test', 'root', 'root', {
      dialect: "mysql",
      port:    3306

	})


	return db.define('User',
	{
		user_id: {type: Sequelize.INTEGER(50), allowNull: false, autoIncrement: true, primaryKey: true},
		// username: {type: Sequelize.STRING, allowNull: false},
		email: {type: Sequelize.STRING, unique: true, allowNull: false, validate: { isEmail: true }},
		password: {type: Sequelize.STRING(500), allowNull: false}
		// first_name: {type: Sequelize.STRING, allowNull: false},
	 //  	last_name: {type: Sequelize.STRING, allowNull: false}
	},

	{

		freezeTableName: true,

		getterMethods: {
			user_id : function () {
		  			return this.getDataValue('user_id');
	  		},

		  	// username: function () {
		  	// 		return this.getDataValue('username');
	  		// },

	  		email: function () {
		  			return this.getDataValue('email');
	  		},

		  	password: function () {
		  			return this.getDataValue('password');
	  		}

		  	// first_name: function () {
		  	// 		return this.getDataValue('first_name');
	  		// },

	  		// last_name: function () {
		  	// 		return this.getDataValue('last_name');
	  		// }
		},

		setterMethods: {
			email: function (newEmail) {
					this.setDataValue('email', newEmail.toString().toLowerCase());
			},

			password: function (newPassword) {
					this.setDataValue('password', newPassword);
			}

			// first_name: function (fn) {
			// 		this.setDataValue('first_name', fn.toString().toLowerCase());
			// },

			// last_name: function (ln) {
			// 		this.setDataValue('last_name', ln.toString().toLowerCase());
			// },


		},

		classMethods : {
				//remember to check for error .
				setPassword : function(password, callback) {
						
						return bcrypt.hash(password, bcrypt.genSaltSync(8), callback);
												
  				}

			},

		  instanceMethods: {
     
		      verifyPassword: function(password, callback) {
		      				console.log("Passed in Password : " + password);
		      				console.log("Password in DB : "+ this.password);
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
