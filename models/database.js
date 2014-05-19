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


  
//defines association of models, add foreign key
global.db.Room.belongsTo(global.db.User, {foreignKey: 'user_created'});

//export modules
module.exports = global.db;
module.exports.User = global.db.User;
module.exports.Room = global.db.Room;

}





