var mongoose = require('mongoose');

var schema = new mongoose.Schema({
	username: {
		type: String,
		index: true,
		unique: true
	},
	password: {
		type: String,
		select: false
	},
	name: String,
	email: {
		type: String,
		unique: true
	},
	token: {
		type: String,
		unique: true
	}
});

module.exports = mongoose.model('User', schema);
