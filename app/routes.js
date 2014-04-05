var rooms = require('./rooms.js');

module.exports = function (app, passport) {



	app.get('/', function (req, res) {
		res.render('login.jade');
	});

	app.get('/rooms', rooms.list);
	app.get('/createroom', rooms.addRoom);

	app.get('/rooms/videochat/:roomName', function (req, res) {
		res.render('videochat.jade', {roomName: req.params.roomName});
	});

	app.post('/login',
	  passport.authenticate('local'),
	  function(req, res) {
	    // If this function gets called, authentication was successful.
	    // `req.user` contains the authenticated user.
	    res.redirect('/createroom' + req.user.username);
	  });



	app.post('/rooms/createARoom', rooms.createARoom);


};

