var express = require('express'),
	router = express.Router();

var crypto = require('crypto');

var moment = require('moment');

var Message = require('../models/message');

var nav = function(req, res, next) {
	res.locals.activeLink = 'messages';

	next();
};

router.get('/', nav, function(req, res, next) {
	var skip = parseInt(req.query.start) || 0;

	var filters = {};

	if (req.query.from && req.query.to) {
		var start = moment(req.query.from).startOf('day'),
			end = moment(req.query.to).endOf('day');

		filters.created = {
			$gte: start.toDate(),
			$lte: end.toDate()
		};
	}

	if (req.query.status) {
		filters.status = req.query.status;
	}

	Message.find(filters).count(function(err, count) {
		if (err) {
			return next(err);
		}

		count = Math.ceil(count / 100);

		var pages = [];

		for (var index = 0; index < count; index++) {
			var link = '?start=' + index * 100;

			if (req.query.from && req.query.to) {
				link += '&from=' + req.query.from + '&to=' + req.query.to;
			}

			if (req.query.status) {
				link += '&status=' + req.query.status;
			}

			pages.push({
				link: link,
				label: index + 1,
				active: skip === index * 100
			});
		}

		Message.find(filters).sort('-created').skip(skip).limit(100).populate('device').exec(function(err, messages) {
			if (err) {
				return next(err);
			}

			res.render('messages', {
				messages: messages,
				data: req.query,
				count: count,
				pages: pages
			});
		});
	});
});

module.exports = router;
