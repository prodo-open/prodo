var mongoose = require('mongoose');

var schema = new mongoose.Schema({
	key: {
		type: String,
		index: true,
		unique: true
	},
	value: String,
	readOnly: {
		type: Boolean,
		default: false
	}
});

module.exports = mongoose.model('Setting', schema);
