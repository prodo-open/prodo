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
	status: String,
	tags: [String]
});

schema.virtual('date.created').get(function() {
	return moment(this.created).fromNow();
});

schema.virtual('date.sent').get(function() {
	return moment(this.sent).fromNow();
});

module.exports = mongoose.model('Message', schema);
