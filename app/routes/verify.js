var User = require('../models/user');
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('../../config/config.js');

exports.getToken = function (user) {
    return jwt.sign(user, config.secretKey, {
        expiresIn: 3600
    });
};

exports.verifyOrdinaryUser = function(req, res, next){
	//check for token in header
	var token = req.body.token || req.query.token || req.headers['x-access-token'];

	if(token){
		// verify and check the token
		jwt.verify(token, config.secretKey, function(err, decoded){
			if(err) {
				var err = new Error('You are not authenticated');
				err.status = 401;
				next(err);
			}
			else{
				req.decoded = decoded;
				next();
			}
		});
	}
	else{
		//if there is no token field
		var err = new Error('No token provided');
		err.status = 403;
		return next(err);
	}
};

