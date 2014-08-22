'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Owner = mongoose.model('Owner'),
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
				message = 'Owner already exists';
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




/*******
 * Create a Owner
 ******/
exports.create = function(req, res) {
	var owner = new Owner(req.body);
	owner.user = req.user;

	owner.save(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(owner);
		}
	});
};

/*******
 * Show the current Owner
 *******/
exports.read = function(req, res) {
	res.jsonp(req.owner);
};

/********
 * Update a Owner
 ********/
exports.update = function(req, res) {    
    Owner.findById(req.body.ownerId).exec(function(err, owner) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {        
            owner.draftPicks=req.body.draftPicks;
            owner.additionalCap=req.body.additionalCap;
            owner.save();
            res.jsonp(owner);
        }
	});  
};

/*******
 * Delete an Owner
 *******/
exports.delete = function(req, res) {
	var owner = req.owner ;

	owner.remove(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(owner);
		}
	});
};

/*******
 * List of Owners
 * Populate with prices of players to calcualte total cap 
 ******/
exports.list = function(req, res) { Owner.find().sort('-created').populate('paidPlayer.roster', 'price name').exec(function(err, owners) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(owners);
		}
	});
};

/*******
 * List of Owners
 * For draft
 ******/
exports.draftList = function(req, res) { Owner.find().sort('-created').populate('paidPlayer.roster').exec(function(err, owners) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(owners);
		}
	});
};


/****
*MAIN FUNCTION WHEN YOU CUT A PLAYER
****/
exports.alterRoster = function(req, res, next) { 
    //change the owner
    Owner.findById(req.params.ownerId).exec(function(err, owners) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
                        
            //cutting a player
            for(var i=0;i<owners.paidPlayer.length;i++){                
                if(owners.paidPlayer[i].name===req.body.positionId){                    
                    owners.paidPlayer[i].roster=req.body.paidPlayer.roster;
                    break;
                }
            }                

            owners.cutPlayer=req.body.cutPlayer;
            owners.save();
		}
	});
    
    //change the player status
    Player.findById(req.body.playerId).exec(function(err, player) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
            if(req.body.cutStatus===0){
                player.unavailable=false;
                player.available=true;
            }
            else{
                player.unavailable=true;
                player.available=false;                
            }
            player.save();
            res.jsonp(player);
        }
	});    
};

/*********
*MAIN FUNCTION WHEN YOU PAY A PLAYER
*********/
exports.addCutPlayer = function(req,res){
    Owner.findById(req.body.ownerId).exec(function(err, owner) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
            owner.cutPlayer=req.body.cutPlayer;
            owner.save();
        }
	});  
    Player.findById(req.body.cutPlayer).exec(function(err, player) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
            player.available=true;
            player.unavailable=false;
            player.save();
            res.jsonp(player);
        }
	});         
};

/********
 * Owner middleware
 ********/
exports.ownerByID = function(req, res, next, id) { Owner.findById(id).populate('paidPlayer.roster').populate('cutPlayer').exec(function(err, owner) {
		if (err) return next(err);
		if (! owner) return next(new Error('Failed to load Owner ' + id));
		req.owner = owner ;
		next();
	});
};

/******
* Execute the trade
*****/
exports.executeTrade=function(req,res){
    //go owner by owners
    //change draft picks
    //change cap
    //change players
    Owner.findById(req.body.owner1Id).exec(function(err, owner1) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
            owner1.additionalCap-=req.body.owner1Cap;
            owner1.additionalCap+=req.body.owner2Cap;
            owner1.draftPicks=req.body.tradeDraft1;
            
            owner1.save();
        }
	});  

    Owner.findById(req.body.owner2Id).exec(function(err, owner2) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
            owner2.additionalCap-=req.body.owner2Cap;
            owner2.additionalCap+=req.body.owner1Cap;
            owner2.draftPicks=req.body.tradeDraft2;
            
            owner2.save();
        }
	});      
    
    res.send(req.body);
    
//            req.owner1Id=$scope.owner1._id;
//            req.owner2Id=$scope.owner2._id;
//            req.tradePlayer1=$scope.tradePlayer1;
//            req.tradePlayer2=$scope.tradePlayer2;
//            req.tradeDraft1=$scope.owner1.draftPicks;
//            req.tradeDraft2=$scope.owner2.draftPicks;
//            req.owner1Cap=$scope.owner1Cap;
//            req.owner2Cap=$scope.owner2Cap;                        
    
    //change the owners
    
    //change the player
};

/********
 * Owner authorization middleware
 *******/
exports.hasAuthorization = function(req, res, next) {
	if (req.owner.user.id !== req.user.id) {
		return res.send(403, 'User is not authorized');
	}
	next();
};

/*******
* ADMIN FUNCTIONS NOT USED
*******/

exports.getName = function(req, res) { 
//    var query={'name':'MichaelHong'};
    
    Owner.findById(req.params.ownerId).exec(function(err, owners) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(owners.totalCap);
		}
	});
};

exports.changePlayer = function(req,res) {
    //cut player and then change position
    var playerArray=['53c1d60786baff4001a5a8f7', '53c1d60786baff4001a5a8f8', '53c1d60786baff4001a5a8fb', '53c1d60786baff4001a5a8fc'];
    
//    for(var x=0;x<playerArray.length;x++){
//        Player.findById(playerArray[x]).exec(function(err, player) {
//            if (err) {
//                return res.send(400, {
//                    message: getErrorMessage(err)
//                });
//            } else {
//                player.available=true;
//                player.unavailable=false;
//                player.save();
//            }
//        });   
//        
//    }
        
    
    Player.findById('53b9a18f3391bfbf8a2e3dde').exec(function(err, player) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
            player.team='CLE';
            player.save();
            res.jsonp(player);
        }
	});     
    
    
};

exports.spotChange = function(req, res) { 
//    var query={'name':'MichaelHong'};
    
    Owner.findById(req.params.ownerId).exec(function(err, owners) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
            owners.totalCap=req.body.totalCap;
            owners.totalPlayers=req.body.totalPlayers;
//            owners.cutPlayer=['53b9a18f3391bfbf8a2e3dd0'];
            

//            owners.paidPlayer=req.body.paidPlayer;
//            owners.cutPlayer=req.body.cutPlayer;
            owners.save();
//            res.send(owners.name + ' ' + owners.totalCap);
            res.jsonp(owners);
            
//            player.salary=req.body.salary;
//            player.save();
//            res.send(player.name + ' ' + player.salary);
//            
//			res.jsonp(owners);
		}
	});
};