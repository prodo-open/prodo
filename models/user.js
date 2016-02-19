var mongoose = require('mongoose');

var schema = new mongoose.Schema({
	email: {
		type: String,
		index: true,
		unique: true
	},
	password: {
		type: String,
		select: false
	},
	name: String,
	token: {
		type: String,
		unique: true
	}
});

module.exports = mongoose.model('User', schema);
