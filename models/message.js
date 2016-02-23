var mongoose = require('mongoose');

var moment = require('moment');

var schema = new mongoose.Schema({
	device: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Device'
	},
	from: String,
	to: String,
	created: Date,
	sent: Date,
	status: {
		type: String,
		validate: {
			validator: function(value) {
				return /pending|queued|failed|sent/i.test(value);
			},
			message: '{VALUE} is not a valid status'
		}
	},
	tags: [String]
});

schema.virtual('date.created').get(function() {
	if (this.created) {
		return moment(this.created).fromNow();
	} else {
		return '-';
	}
});

schema.virtual('date.sent').get(function() {
	if (this.sent) {
		return moment(this.sent).fromNow();
	} else {
		return '-';
	}
});

module.exports = mongoose.model('Message', schema);
