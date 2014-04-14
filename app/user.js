var bcrypt = require('bcrypt-nodejs');

module.exports = function () {

	var Sequelize = require('sequelize');
	var db = new Sequelize('test', 'root', 'root', {
      dialect: "mysql", 
      port:    3306

	})


	var User = db.define('User', {
		user_id: {type: Sequelize.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true},
		// username: {type: Sequelize.STRING, allowNull: false},
		email: {type: Sequelize.STRING, allowNull: false},
		password: {type: Sequelize.STRING, allowNull: false}
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

			password: function (newPassWord) {
					this.setDataValue('password', newPassWord.toString().toLowerCase());				
			}

			// first_name: function (fn) {
			// 		this.setDataValue('first_name', fn.toString().toLowerCase());				
			// },

			// last_name: function (ln) {
			// 		this.setDataValue('last_name', ln.toString().toLowerCase());				
			// },


		},

		classMethods : {
				generateHash : function(password) {
			    		 return bcrypt.hashSync(password, null, null, function (err, hash) {
			    			return hash;
			    	});
				},
				
				validPassword : function(password, pass) {
				    return bcrypt.compareSync(password, pass, function (err, res) {
				    		return res;
				    });
				}

						
			}

	

		
	})

	
	// User.generateHash = function(password) {
 //    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
	// };

	// checking if password is valid
	// User.validPassword = function(password) {
	//     return bcrypt.compareSync(password, this.password);
	// };

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


