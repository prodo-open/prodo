var express = require('express'),
	router = express.Router();

var auth = require('../prodo/auth');

router.get('/login', function(req, res, next) {
	if (auth.isLoggedIn(req)) {
		res.redirect('/');
	} else {
		res.render('login');
	}
});

router.post('/login', function(req, res, next) {
	if (req.body.username && req.body.password) {
		auth.login(req.body.username, req.body.password, function(err, user) {
			if (err) {
				return next(err);
			}

			if (user) {
				res.cookie('token', user.token);

				res.redirect('/');
			} else {
				res.render('login', {
					username: req.body.username,
					error: 'Username / password incorrect'
				});
			}
		});
	} else {
		var error = new Error('Not found');
		error.status = 400;

		next(error);
	}
});

router.get('/logout', function(req, res, next) {
	res.clearCookie('token');

	res.redirect('/users/login');
});

module.exports = router;
