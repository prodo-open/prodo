var mongoose = require('mongoose');

var schema = new mongoose.Schema({
	key: {
		type: String,
		index: true,
		unique: true
	},
	value: String
}, {
	_id: false,
	versionKey: false
});

module.exports = mongoose.model('Setting', schema);
