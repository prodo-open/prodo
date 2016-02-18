var express = require('express'),
	router = express.Router();

var auth = require('../prodo/auth');

router.get('/', function(req, res, next) {
	if (auth.isLoggedIn(req)) {
		res.redirect('/dashboard');
	} else {
		res.redirect('/users/login');
	}
});

module.exports = router;
