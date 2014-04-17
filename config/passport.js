
var LocalStrategy   = require('passport-local').Strategy;
var User = require('../app/user')();


module.exports = function (passport) {

    //used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.user_id);
    });

    //used to deserialize the user
    passport.deserializeUser(function(id, done) {
       	User.find({where: {user_id: id}})
       		.complete(function (err, user) {
       			done(err, user);
       		})
           });


 	// =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    
    passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) {

   
        // asynchronous
        // User.find wont fire unless data is sent back
        process.nextTick(function() {

		// find a user whose email is the same as the forms email
		// we are checking to see if the user trying to login already exists
        User.find({where: {email : email}})
        	.complete(function(err, user) {
                
            // if there are any errors, return the error
            if (err){
                
                return done(err);
            }

            // check to see if theres already a user with that email
            if (user) {
                return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
            } else {


			   //      	User
						//   .create({
						//     email: email,
						//     password: User.setPassword(password)

						//   })
						//   .complete(function(err, newUser) {
						//     if (err) 
						//     	throw err;
						//     return done(null, newUser)
			 		// })
                User.setPassword(password, function (err, encrypted) {
                      if (err) return done(err);
                      User.create({
                        email: email,
                        password: encrypted
                      })
                        .complete(function (err, user) {
                            if (err) throw err;
                            return done(null, user)
                        })
                    });



            }

        });    

        });

    }));

	
    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================

    passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) { // callback with email and password from our form

		// find a user whose email is the same as the forms email
		// we are checking to see if the user trying to login already exists
        User.find({where: { email :  email }})
        	.complete(function(err, user) {

            if (err)
                return done(err);

            if (!user){
                
                return done(null, false, req.flash('loginMessage', 'No user found.')); 
            }
			// if the user is found but the password is wrong
            
            // if (!user.verifyPassword(password)){
                
            //     console.log("user.password: " + user.password);
            //     console.log("password: " + password);
            //     return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));
            // }
            // // all is well, return successful user
            // return done(null, user);
            user.verifyPassword(password, function (err, result) {
                console.log(!result);
                  if (err || !result) return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));
                  return done(null, user);
                });
        });

    }));


};