'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Player = mongoose.model('Player'),
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
				message = 'Player already exists';
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

/********
 * Create a Player
 *******/
exports.create = function(req, res) {
	var player = new Player(req.body);
	player.user = req.user;

	player.save(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(player);
		}
	});
};

/*********
 * Show the current Player
 ********/
exports.read = function(req, res) {
	res.jsonp(req.player);
};

/********
 * Update a Player
 *******/
exports.update = function(req, res) {
    
    Player.findById(req.body.playerId).exec(function(err, player) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {        
            player.name=req.body.name;
            player.team=req.body.team;
            player.byeWeek=req.body.byeWeek;
            player.price=req.body.price;
            player.available=req.body.available;
            player.unavailable=req.body.unavailable;
            if(player.owner){
                player.owner=req.body.owner._id;                
            }
            player.contractYear=req.body.contractYear;
            player.rookie=req.body.rookie;
            
            console.log('rank: ' + player.startRank.absRank);
//            console.log(req.)
            player.startRank=req.body.startRank;
            
            
            player.save();
            console.log('rank: ' + player.startRank.absRank);
            res.jsonp(player);
        }
	});  
    
};

/*********
* Update the Owner of the Player
**********/
exports.updatePlayerOwner=function(req,res){
    Player.findById(req.body.playerId).exec(function(err, player) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {        
            player.owner=req.body.owner;
            player.save();
            res.jsonp(player);
        }
	});     
};

/*******
 * Delete an Player
 ******/
exports.delete = function(req, res) {
	var player = req.player ;

	player.remove(function(err) {
		if (err) {
            console.log('not delted');
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
            console.log('player deleted');
			res.jsonp(player);
		}
	});
};

/*******
 * List of Players
 ******/
exports.list = function(req, res) { Player.find().sort('-created').populate('owner', 'name').exec(function(err, players) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(players);
		}
	});
};

/*********
 * Player middleware
 *******/
exports.playerByID = function(req, res, next, id) { Player.findById(id).populate('owner', 'name').exec(function(err, player) {
		if (err) return next(err);
		if (! player) return next(new Error('Failed to load Player ' + id));
		req.player = player ;
		next();
	});
};

/*******
 * Player authorization middleware
 ******/
exports.hasAuthorization = function(req, res, next) {
	if (req.player.user.id !== req.user.id) {
		return res.send(403, 'User is not authorized');
	}
	next();
};