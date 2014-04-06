module.exports = function (Sequelize, db) {


	var ChatSession = db.define('ChatSession', {
		session_id : {type: Sequelize.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true},
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
				return this.getDataValue('session_id');
			},
			uid: function () {
				return this.getDataValue('uid');
			},
			start_time: function () {
				return this.getDataValue('start_time');
			},
			end_time: function () {
				return this.getDataValue('end_time');
			}
		},
		setterMethods: {

		}
	})

	


	db
		.sync({force: true})
		.complete(function (err) {
			if (!!err) {
		       console.log('An error occurred while create the table:', err)
		    } else {
		       console.log('table ' + ChatSession.tableName + ' created!');
		    }
		})

	return ChatSession;	
}