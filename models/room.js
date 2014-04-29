// var Sequelize = require('./database');

module.exports = function (Sequelize, db) {

	// var Sequelize = require('sequelize');
	// var db = new Sequelize('test', 'root', 'root', {
 //      dialect: "mysql", 
 //      port:    3306

	// })


	var Room = db.define('Room', {
		room_id : {type: Sequelize.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true},
		room_name: {type: Sequelize.STRING, allowNull: false},
		start_time: {type: Sequelize.DATE},
		end_time: {type: Sequelize.DATE}
	},

	{
		
		createdAt: false,
		updatedAt: false,
		freezeTableName: true
		
	},

	{
		getterMethods: {
			session_id: function () {
				return this.getDataValue('room_id');
			},
			user_id: function () {
				return this.getDataValue('user_id');
			},
			start_time: function () {
				return this.getDataValue('start_time');
			},
			end_time: function () {
				return this.getDataValue('end_time');
			}
		},
		setterMethods: {
			start_time: function (st) {
					this.setDataValue('start_time', st);
			},
			end_time: function (et) {
					this.setDataValue('end_time', et);
			}

		}
	})

	


	db
		.sync({force: true})
		.complete(function (err) {
			if (!!err) {
		       console.log('An error occurred while create the table:', err)
		    } else {
		       console.log('table ' + Room.tableName + ' synced!');
		    }
		})

	return Room;	
}