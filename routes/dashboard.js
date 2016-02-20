var express = require('express'),
	router = express.Router();

var nav = function(req, res, next) {
	res.locals.activeLink = 'dashboard';

	next();
};

router.get('/', nav, function(req, res, next) {
	res.render('dashboard');
});

module.exports = router;
