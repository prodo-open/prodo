var mongoose = require('mongoose');

var request = require('request');

var schema = new mongoose.Schema({
	description: String,
	event: {
		type: String,
		validate: {
			validator: function(value) {
				return /incoming|outgoing/i.test(value);
			},
			message: '{VALUE} is not a valid event'
		}
	},
	uri: String,
	headers: [mongoose.Schema.Types.Mixed],
	created: {
		type: Date,
		default: Date.now
	}
});

schema.statics.push = function(event, message) {
	this.find({
		event: event
	}, function(err, webhooks) {
		if (err) {
			return console.error(err);
		}

		webhooks.forEach(function(webhook) {
			request({
				method: 'POST',
				uri: webhook.uri,
				json: true,
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(message)
			}, function(err, res) {
				if (err) {
					console.error(err);
				}
			});
		});
	});
};

module.exports = mongoose.model('Webhook', schema);
