// var express = require('express');
var express = require('express');

var http = require('http');
var path = require('path');
var app  = express();
var passport = require('passport');
var flash 	 = require('connect-flash');
var db      = require('./models/database');

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser());
// required for passport
app.use(express.session({ secret: 'iloveplayingtennis' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'controllers')));


// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// launch server

// var server = http.createServer(app).listen(app.get('port'), function(){
//   console.log('Express server listening on port ' + app.get('port'));
// });
db.sequelize.sync({force: true}).complete(function(err) {
  if (err) {
    throw err[0]
  } else {
    var server = http.createServer(app).listen(app.get('port'), function(){
      console.log('Express server listening on port ' + app.get('port'))
    })
    // routes 
	require('./controllers/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

	//for authentication
	require('./controllers/auth.js')(passport); // pass passport for configuration


	//database config 
	var configDB = require('./models/database.js');

	//server side of video and text chat
	var io = require('socket.io').listen(server);

	require('./controllers/chatServer.js')(io);


  }
})




