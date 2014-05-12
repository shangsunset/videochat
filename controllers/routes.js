var createRoom = require('./createRoom.js');
var roomsList = require('./roomsList.js');
var Room = require('../models/database').Room;


module.exports = function (app, passport) {



	app.get('/', function (req, res) {
		res.render('login.jade', { message: req.flash('loginMessage') });
	});

	app.get('/signup', function (req, res) {
		res.render('signup.jade', { message: req.flash('signupMessage') });
	});


	app.get('/rooms', roomsList.list);

	app.get('/createroom', function (req, res) {

		Room.findAll().success(function(rooms) {
  			res.render('createRoom.jade', {userEmail: req.user.email, rooms: rooms})
		})
	});

	app.get('/rooms/videochat/:roomName/:roomId', function (req, res) {
		res.render('videochat.jade', {roomName: req.params.roomName, roomId: req.params.roomId});
	});

	app.post('/rooms/createRoom', createRoom.create);


	
	//process the signup form
	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect : '/createroom', // redirect to the secure profile section
		failureRedirect : '/signup', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));



	// process the login form
	app.post('/login', passport.authenticate('local-login', {
		successRedirect : '/createroom', // redirect to the secure profile section
		failureRedirect : '/', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));



	

};

