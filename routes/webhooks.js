var express = require('express'),
	router = express.Router();

var Webhook = require('../models/webhook');

var nav = function(req, res, next) {
	res.locals.activeLink = 'webhooks';

	next();
};

router.get('/', nav, function(req, res, next) {
	Webhook.find(function(err, webhooks) {
		if (err) {
			return next(err);
		}

		res.render('webhooks/index', {
			webhooks: webhooks
		});
	});
});

router.get('/:id/edit', nav, function(req, res, next) {
	Webhook.findById(req.params.id, function(err, webhook) {
		if (err) {
			return next(err);
		}

		res.render('webhooks/view', {
			webhook: webhook
		});
	});
});

router.put('/:id/edit', function(req, res, next) {
	if (req.body.description || req.body.event || req.body.uri || req.body.headers) {
		Webhook.findById(req.params.id, function(err, webhook) {
			if (err) {
				return next(err);
			}

			if (req.body.description) {
				webhook.description = req.body.description;
			}

			if (req.body.event) {
				webhook.event = req.body.event;
			}

			if (req.body.uri) {
				webhook.uri = req.body.uri;
			}

			webhook.headers = req.body.headers || [];

			if (webhook.isModified()) {
				webhook.save(function(err) {
					if (err) {
						return next(err);
					}

					res.send({
						message: 'Webhook updated'
					});
				});
			} else {
				res.send({
					message: 'Webhook updated'
				});
			}
		});
	} else {
		res.status(400).send({
			error: 'Fields are missing'
		});
	}
});

router.delete('/:id/remove', function(req, res, next) {
	Webhook.findOneAndRemove({
		_id: req.params.id
	}, function(err) {
		if (err) {
			return next(err);
		}

		res.send({
			message: 'Webhook removed'
		});
	});
});

router.get('/new', nav, function(req, res, next) {
	res.render('webhooks/new');
});

router.post('/new', function(req, res, next) {
	if (req.body.description && req.body.event && req.body.uri) {
		var webhook = new Webhook();

		webhook.description = req.body.description;
		webhook.event = req.body.event;
		webhook.uri = req.body.uri;

		webhook.headers = req.body.headers;

		webhook.save(function(err) {
			if (err) {
				return next(err);
			}

			res.send({
				message: 'Webhook added'
			});
		});
	} else {
		res.status(400).send({
			error: 'Fields are missing'
		});
	}
});

module.exports = router;
