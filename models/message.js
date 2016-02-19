var mongoose = require('mongoose');

var schema = new mongoose.Schema({
	from: String,
	to: String,
	created: Date,
	sent: Date,
	status: String,
	tags: [String]
});

module.exports = mongoose.model('Message', schema);
