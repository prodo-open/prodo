var mongoose = require('mongoose');

var schema = new mongoose.Schema({
	name: {
		type: String,
		unique: true
	},
	token: {
		type: String,
		unique: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	updated: {
		type: Date,
		default: Date.now
	}
});

schema.methods.isOnline = function() {
	return this.updated && Date.now() - this.updated > (60 * 5 * 1000);
};

module.exports = mongoose.model('Device', schema);
