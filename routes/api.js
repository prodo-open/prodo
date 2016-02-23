var express = require('express'),
	router = express.Router();

var Setting = require('../models/setting'),
	Message = require('../models/message');

router.get('/settings', function(req, res, next) {
	Settings.find(function(err, settings) {
		if (err) {
			return next(err);
		}

		res.send(settings);
	});
});

router.post('/messages', function(req, res, next) {
	if (req.body.from && req.body.to && req.body.created && req.body.sent && req.body.status) {
		var message = new Message();

		message.device = req.device._id;
		message.from = req.body.from;
		message.to = req.body.to;
		message.created = req.body.created;
		message.sent = req.body.sent;
		message.status = req.body.status;
		message.tags = ['incoming'];

		message.save(function(err, message) {
			if (err) {
				return next(err);
			}

			res.send({
				id: message._id
			});
		});
	} else {
		var error = new Error('Fields are missing');
		error.status = 400;

		next(error);
	}
});

router.put('/messages/:id', function(req, res, next) {
	if (req.body.status || req.body.sent) {
		Message.findById(req.params.id, function(err, message) {
			if (err) {
				return next(err);
			}

			if (req.body.status) {
				message.status = req.body.status;
			}

			if (req.body.sent) {
				message.sent = req.body.sent;
			}

			if (message.isModified()) {
				message.save(function(err) {
					if (err) {
						return next(err);
					}

					res.send({});
				});
			} else {
				res.send({});
			}
		});
	} else {
		var error = new Error('Fields are missing');
		error.status = 400;

		next(error);
	}
});

module.exports = router;
