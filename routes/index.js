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
		res.redirect('/users/login');
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

			if (user) {
				Setting.insertMany([{
					key: 'installed',
					value: true
				}, {
					key: 'installed_on',
					value: Date.now()
				}], function(err) {
					if (err) {
						console.error(err);
					}
				});

				res.render('login', {
					email: user.email,
					message: 'User created. You may now login'
				});
			} else {
				return next(new Error());
			}
		});
	} else {
		res.render('install', {
			name: req.body.name,
			email: req.body.email,
			error: 'Fields are missing'
		});
	}
});

module.exports = router;
