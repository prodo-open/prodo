var express = require('express'),
	router = express.Router();

var crypto = require('crypto');

var Device = require('../models/device');

var nav = function(req, res, next) {
	res.locals.activeLink = 'devices';

	next();
};

router.get('/', nav, function(req, res, next) {
	Device.find(function(err, devices) {
		if (err) {
			return next(err);
		}

		res.render('devices/index', {
			devices: devices
		});
	});
});

router.get('/:id/edit', function(req, res, next) {
	Device.findById(req.params.id, function(err, device) {
		if (err) {
			return next(err);
		}

		res.render('devices/view', {
			device: device
		});
	});
});

router.put('/:id/edit', function(req, res, next) {
	if (req.body.name) {
		Device.findById(req.params.id, function(err, device) {
			if (err) {
				return next(err);
			}

			if (req.body.name) {
				device.name = req.body.name;
			}

			if (device.isModified()) {
				device.updated = Date.now();

				device.save(function(err) {
					if (err) {
						if (err.toJSON().code === 11000) {
							var error = new Error('Device name is already in use');
							error.status = 400;

							return next(error);
						} else {
							return next(err);
						}
					}

					res.send({
						message: 'Device updated'
					});
				});
			} else {
				res.send({
					message: 'Device updated'
				});
			}
		});
	} else {
		res.status(400).send({
			error: 'Fields are missing'
		});
	}
});

router.get('/:id/refresh', function(req, res, next) {
	Device.findById(req.params.id, function(err, device) {
		if (err) {
			return next(err);
		}

		device.token = crypto.createHash('sha256').update(device.name + Date.now()).digest('hex');

		device.updated = Date.now();

		device.save(function(err) {
			if (err) {
				return next(err);
			}

			res.send({
				message: 'Token refreshed. Please update your device',
				token: device.token
			});
		});
	});
});

router.delete('/:id/remove', function(req, res, next) {
	Device.findOneAndRemove({
		_id: req.params.id
	}, function(err) {
		if (err) {
			return next(err);
		}

		res.send({
			message: 'Device removed'
		});
	});
});

router.get('/new', function(req, res, next) {
	res.render('devices/new');
});

router.post('/new', function(req, res, next) {
	if (req.body.name) {
		var devices = Device.count(function(err, count) {
			if (count > 0) {
				res.status(400).send({
					error: 'You can only have one device'
				});
			} else {
				var device = new Device();

				device.name = req.body.name;

				device.token = crypto.createHash('sha256').update(req.body.name + Date.now()).digest('hex');

				device.save(function(err, device) {
					if (err) {
						if (err.toJSON().code === 11000) {
							var error = new Error('Device name is already in use');
							error.status = 400;

							return next(error);
						} else {
							return next(err);
						}
					}

					res.send({
						message: 'Device added'
					});
				});
			}
		});
	} else {
		res.status(400).send({
			error: 'Fields are missing'
		});
	}
});

module.exports = router;
