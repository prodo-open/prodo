var express = require('express'),
	router = express.Router();

var Device = require('../models/device'),
	Message = require('../models/message');

var nav = function(req, res, next) {
	res.locals.activeLink = 'dashboard';

	next();
};

router.get('/', nav, function(req, res, next) {
	Device.find(function(err, devices) {
		if (err) {
			return next(err);
		}

		Message.aggregate({
			$group: {
				_id: '$status',
				total: {
					$sum: 1
				}
			}
		}, function(err, statuses) {
			if (err) {
				return next(err);
			}

			res.render('dashboard', {
				devices: devices,
				statuses: statuses
			});
		});
	});
});

module.exports = router;
