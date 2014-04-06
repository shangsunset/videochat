var express = require('express');
var http = require('http');
var path = require('path');
var app = express();
var passport = require('passport');


// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.cookieParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'app')));


// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// launch server ======================================================================

var server = http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});



// routes ======================================================================
require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport


//database config ======================================================================
var configDB = require('./config/database.js');
configDB.db();

//server side of video and text chat ======================================================================
var io = require('socket.io').listen(server);

require('./app/chat-server.js')(io);


