var express = require('express'),
	router = express.Router();

var crypto = require('crypto');

var auth = require('../prodo/auth');

var User = require('../models/user');

var nav = function(req, res, next) {
	res.locals.activeLink = 'users';

	next();
};

router.get('/', auth.authenticated, nav, function(req, res, next) {
	User.find(function(err, users) {
		if (err) {
			return next(err);
		}

		if (!users) {
			return next();
		}

		res.render('users/index', {
			users: users
		});
	});
});

router.get('/:id/edit', auth.authenticated, function(req, res, next) {
	User.findById(req.params.id, function(err, user) {
		if (err) {
			return next(err);
		}

		if (!user) {
			return next();
		}

		res.render('users/view', {
			user: user,
			isLoggedInUser: user._id.equals(res.locals.authUser._id)
		});
	});
});

router.put('/:id/edit', auth.authenticated, function(req, res, next) {
	if (req.body.name || req.body.email) {
		User.findById(req.params.id, function(err, user) {
			if (err) {
				return next(err);
			}

			if (!user) {
				return next();
			}

			if (req.body.name) {
				user.name = req.body.name;
			}

			if (req.body.email) {
				user.email = req.body.email;
			}

			if (user.isModified()) {
				user.save(function(err) {
					if (err) {
						return next(err);
					}

					res.send({
						message: 'User updated'
					});
				});
			} else {
				res.send({
					message: 'User updated'
				});
			}
		});
	} else {
		res.status(400).send({
			error: 'Fields are missing'
		});
	}
});

router.delete('/:id/remove', auth.authenticated, function(req, res, next) {
	if (res.locals.authUser._id.equals(req.params.id)) {
		res.status(403).send({
			error: 'You cannot remove yourself'
		});
	} else {
		User.findOneAndRemove({
			_id: req.params.id
		}, function(err) {
			if (err) {
				return next(err);
			}

			res.send({
				message: 'User removed'
			});
		});
	}
});

router.get('/new', auth.authenticated, function(req, res, next) {
	res.render('users/new');
});

router.post('/new', function(req, res, next) {
	if (req.body.name && req.body.email && req.body.password) {
		var user = new User();

		user.name = req.body.name;
		user.email = req.body.email;

		user.password = crypto.createHash('sha256').update(req.body.password).digest('hex');
		user.token = crypto.createHash('sha256').update(req.body.name + req.body.email + req.body.password + Date.now()).digest('hex');

		user.save(function(err, user) {
			if (err) {
				if (err.toJSON().code === 11000) {
					var error = new Error('Email address is already in use');
					error.status = 400;

					return next(error);
				} else {
					return next(err);
				}
			}

			res.send({
				message: 'User added'
			});
		});
	} else {
		res.status(400).send({
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

	res.redirect('/users/login');
});

module.exports = router;
