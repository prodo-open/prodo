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
