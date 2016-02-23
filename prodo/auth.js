var User = require('../models/user'),
	Device = require('../models/device');

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
			var error = new Error();
			error.status = 401;

			next(error);
		} else {
			res.redirect('/login');
		}
	}
};

exports.deviceAuthenticated = function(req, res, next) {
	if (req.headers.token) {
		Device.findOne({
			token: req.headers.token
		}, function(err, device) {
			if (err || !device) {
				var error = new Error('Invalid device token');
				error.status = 403;

				return next(error);
			}

			req.device = device;

			device.updated = Date.now();

			device.save(function(err) {
				if (err) {
					return next(err);
				} else {
					next();
				}
			});
		});
	} else {
		var error = new Error('Missing device token');
		error.status = 401;

		next(error);
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
