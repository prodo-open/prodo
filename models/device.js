var mongoose = require('mongoose');

var schema = new mongoose.Schema({
	name: String,
	token: {
		type: String,
		unique: true
	},
	created: Date,
	updated: {
		type: Date,
		default: Date.now
	}
});

schema.methods.isOnline = function() {
	return this.updated && Date.now() - this.updated > (60 * 5 * 1000);
};

module.exports = mongoose.model('Device', schema);
