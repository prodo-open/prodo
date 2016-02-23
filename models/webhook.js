var mongoose = require('mongoose');

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

module.exports = mongoose.model('Webhook', schema);
