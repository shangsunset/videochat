var rooms = require('./rooms.js');

module.exports = function (app, passport) {



	app.get('/', function (req, res) {
		res.render('login.jade');
	});

	app.get('/signup', function (req, res) {
		res.render('signup.jade');
	});


	app.get('/rooms', rooms.list);
	app.get('/createroom', rooms.addRoom);

	app.get('/rooms/videochat/:roomName', function (req, res) {
		res.render('videochat.jade', {roomName: req.params.roomName});
	});

	app.post('/rooms/createARoom', rooms.createARoom);


	
	//process the signup form
	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect : '/', // redirect to the secure profile section
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

