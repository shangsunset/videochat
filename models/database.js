if (!global.hasOwnProperty('db')) {
  var Sequelize = require('sequelize')
    , sequelize = null
 
  if (process.env.HEROKU_POSTGRESQL_GOLD_URL) {
    // the application is executed on Heroku ... use the postgres database
    var match = process.env.HEROKU_POSTGRESQL_GOLD_URL.match(/postgres:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/)
 
    sequelize = new Sequelize(match[5], match[1], match[2], {
      dialect:  'postgres',
      protocol: 'postgres',
      port:     match[4],
      host:     match[3],
      logging:  true //false
    })


  } else {
    // the application is executed on the local machine ... use mysql
    sequelize = new Sequelize('test', 'root', 'root')
  }


  global.db = {
    Sequelize: Sequelize,
    sequelize: sequelize,
    User:      require('./user.js')(Sequelize, sequelize),
    Room:      require('./room.js')(Sequelize, sequelize)
 
    // add your other models here
  };

  // sequelize
	 //  .authenticate()
	 //  .complete(function(err) {
	 //    if (!!err) {
	 //      console.log('Unable to connect to the database:', err)
	 //    } else {
	 //      console.log('Connection has been established successfully!')
	 //    }
	 //  })
  
	
global.db.Room.belongsTo(global.db.User, {foreignKey: 'user_created'});
// var Sequelize = require('sequelize');
// var db = new Sequelize('test', 'root', 'root', {
//     dialect: "mysql", 
//     port: 3306

// })

module.exports = global.db;
module.exports.User = global.db.User;
module.exports.Room = global.db.Room;

}
// var User = require('./user.js')(Sequelize, db);
// var Room = require('./room.js')(Sequelize, db);
// module.exports.Room = Room;
// module.exports.User = User;



// module.exports = function(){

	
	

// };


// User.hasMany(Room);
// Room.belongsTo(User, {foreignKey: 'user_id'})




