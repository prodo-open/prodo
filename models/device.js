var mongoose = require('mongoose');

var moment = require('moment');

var schema = new mongoose.Schema({
	name: {
		type: String,
		unique: true
	},
	token: {
		type: String,
		index: true,
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

schema.virtual('online').get(function() {
	var fiveMinutesAgo = moment().subtract(5, 'minutes')

	return moment(this.updated).isAfter(fiveMinutesAgo);
});

module.exports = mongoose.model('Device', schema);
