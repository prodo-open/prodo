var User = require('../models/user');

exports.authenticated = function(req, res, next) {
	if (exports.isLoggedIn(req)) {
		User.findOne({
			token: req.cookies.token
		}, function(err, user) {
			if (err) {
				return next(err);
			}

			if (user) {
				res.locals.authUser = user;

				next();
			} else {
				res.clearCookie('token');

				res.redirect('/login');
			}
		});
	} else {
		if (req.xhr) {
			res.status(401).send({});
		} else {
			res.redirect('/login');
		}
	}
};

exports.login = function(email, password, callback) {
	User.findOne({
		email: email,
		password: require('crypto').createHash('sha256').update(password).digest('hex')
	}, function(err, user) {
		if (typeof callback === 'function') {
			callback(err, user);
		}
	});
};

exports.isLoggedIn = function(req) {
	return req.cookies.token ? true : false;
};
