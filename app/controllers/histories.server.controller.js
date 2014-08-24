'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	History = mongoose.model('History'),
	_ = require('lodash');

/**
 * Get the error message from error object
 */
var getErrorMessage = function(err) {
	var message = '';

	if (err.code) {
		switch (err.code) {
			case 11000:
			case 11001:
				message = 'History already exists';
				break;
			default:
				message = 'Something went wrong';
		}
	} else {
		for (var errName in err.errors) {
			if (err.errors[errName].message) message = err.errors[errName].message;
		}
	}

	return message;
};

/**
 * Create a History
 */
exports.create = function(req, res) {
	var history = new History(req.body);
	history.user = req.user;

	history.save(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(history);
		}
	});
};

/**
 * Show the current History
 */
exports.read = function(req, res) {
	res.jsonp(req.history);
};

/**
 * Update a History
 */
exports.update = function(req, res) {
	var history = req.history ;

	history = _.extend(history , req.body);

	history.save(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(history);
		}
	});
};

/**
 * Delete an History
 */
exports.delete = function(req, res) {
	var history = req.history ;

	history.remove(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(history);
		}
	});
};

/**
 * List of Histories
 */
exports.list = function(req, res) { History.find().sort('-created').populate('owner', 'name').populate('player', 'name').exec(function(err, histories) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(histories);
		}
	});
};

/**
 * History middleware
 */
exports.historyByID = function(req, res, next, id) { History.findById(id).populate('user', 'displayName').exec(function(err, history) {
		if (err) return next(err);
		if (! history) return next(new Error('Failed to load History ' + id));
		req.history = history ;
		next();
	});
};

/**
 * History authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.history.user.id !== req.user.id) {
		return res.send(403, 'User is not authorized');
	}
	next();
};