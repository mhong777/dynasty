'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Bid = mongoose.model('Bid'),
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
				message = 'Bid already exists';
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
 * Create a Bid
 */
exports.create = function(req, res) {
	var bid = new Bid(req.body);
	bid.user = req.user;

	bid.save(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(bid);
		}
	});
};

/**
 * Show the current Bid
 */
exports.read = function(req, res) {
	res.jsonp(req.bid);
};

/**
 * Update a Bid
 */
exports.update = function(req, res) {
	var bid = req.bid ;

	bid = _.extend(bid , req.body);

	bid.save(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(bid);
		}
	});
};

/**
 * Delete an Bid
 */
exports.delete = function(req, res) {
	var bid = req.bid ;

	bid.remove(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(bid);
		}
	});
};

/**
 * List of Bids
 */
exports.list = function(req, res) { Bid.find().sort('-created').populate('user', 'displayName').exec(function(err, bids) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(bids);
		}
	});
};

/**
 * Bid middleware
 */
exports.bidByID = function(req, res, next, id) { Bid.findById(id).populate('user', 'displayName').exec(function(err, bid) {
		if (err) return next(err);
		if (! bid) return next(new Error('Failed to load Bid ' + id));
		req.bid = bid ;
		next();
	});
};

/**
 * Bid authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.bid.user.id !== req.user.id) {
		return res.send(403, 'User is not authorized');
	}
	next();
};