var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');
var Verify = require('./verify');


/* GET users listing. */

router.post('/register', function(req, res, next){
	console.log("reached in /register");
	res.setHeader("Access-Control-Allow-Origin", "*");
    	res.setHeader("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With, X-Access-Token");
	User.register(new User({ username : req.body.username, role: req.body.role }), req.body.password, function(err, user) {
		if (err) {
		    return res.status(500).json({err: err});
		}
		passport.authenticate('local')(req, res, function () {
		    return res.status(200).json({status: 'Registration Successful!'});
		});
	});
});

router.post('/login', function(req, res, next){
	console.log("reached in /login");
	res.setHeader("Access-Control-Allow-Origin", "*");
    	res.setHeader("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With, X-Access-Token");
	passport.authenticate('local', function(err, user, info){
		if(err){
			return next(err);
		}
		if (!user) {
			return res.status(401).json({
				err: info
			});
		}
		req.logIn(user, function(err) {
			if (err) {
				return res.status(500).json({
			  		err: 'Could not log in user'
				});
			}

			var token = Verify.getToken(user);

			res.status(200).json({
				status: 'Login successful!',
				success: true,
				token: token,
				role: user.role,
				name: user.username
			});
		});
	})(req, res, next);
});

router.get('/logout', function(req, res) {
	req.logout();
	res.status(200).json({
		status: 'Logged out successfully!'
	});
});

module.exports = router;
