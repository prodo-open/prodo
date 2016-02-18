var User = require('../models/user');

exports.auth = function(req, res, next) {
	if (exports.isLoggedIn(req)) {
		User.findOne({
			token: req.cookies.token
		}, function(err, user) {
			if (err) {
				return next(err);
			}

			if (user) {
				res.locals.user = user;

				next();
			} else {
				res.clearCookie('token');

				res.redirect('/users/login');
			}
		});
	} else {
		res.redirect('/users/login');
	}
};

exports.login = function(username, password, callback) {
	User.findOne({
		username: username,
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
