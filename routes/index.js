var express = require('express'),
	router = express.Router();

var crypto = require('crypto');

var auth = require('../prodo/auth');

var Setting = require('../models/setting'),
	User = require('../models/user');

router.get('/', function(req, res, next) {
	if (auth.isLoggedIn(req)) {
		res.redirect('/dashboard');
	} else {
		res.redirect('/login');
	}
});

router.get('/install', function(req, res, next) {
	Setting.findOne({
		key: 'installed'
	}, function(err, setting) {
		if (err) {
			return next(err);
		}

		if (setting) {
			res.render('login', {
				message: 'Prodo is already installed'
			});
		} else {
			res.render('install');
		}
	})
});

router.post('/install', function(req, res, next) {
	if (req.body.name && req.body.email && req.body.password) {
		var user = new User();

		user.name = req.body.name;
		user.email = req.body.email;

		user.password = crypto.createHash('sha256').update(req.body.password).digest('hex');
		user.token = crypto.createHash('sha256').update(req.body.name + req.body.email + req.body.password + Date.now()).digest('hex');

		user.save(function(err, user) {
			if (err) {
				return next(err);
			}

			Setting.insertMany([{
				key: 'installed',
				value: true,
				readOnly: true
			}, {
				key: 'installed_on',
				value: Date.now(),
				readOnly: true
			}], function(err) {
				if (err) {
					console.error(err);
				}
			});

			res.render('login', {
				email: user.email,
				message: 'User created. You may now login'
			});
		});
	} else {
		res.render('install', {
			name: req.body.name,
			email: req.body.email,
			error: 'Fields are missing'
		});
	}
});

router.get('/login', function(req, res, next) {
	if (auth.isLoggedIn(req)) {
		res.redirect('/');
	} else {
		res.render('login');
	}
});

router.post('/login', function(req, res, next) {
	if (req.body.email && req.body.password) {
		auth.login(req.body.email, req.body.password, function(err, user) {
			if (err) {
				return next(err);
			}

			if (user) {
				res.cookie('token', user.token);

				res.redirect('/');
			} else {
				res.render('login', {
					email: req.body.email,
					error: 'Email / password incorrect'
				});
			}
		});
	} else {
		res.render('login', {
			email: req.body.email,
			error: 'Email / password missing'
		});
	}
});

router.get('/logout', function(req, res, next) {
	res.clearCookie('token');

	res.redirect('/login');
});

module.exports = router;
