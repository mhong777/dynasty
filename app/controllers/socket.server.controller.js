module.exports = function (io) {
    'use strict';
var mongoose = require('mongoose'),
	Owner = mongoose.model('Owner'),
    Player = mongoose.model('Player'),
	Bid = mongoose.model('Bid'),    
	_ = require('lodash');
    
    
    io.on('connection', function(socket){
        socket.broadcast.emit('user connected');
        
        //chat function
         socket.on('send msg', function(msg){
            console.log(msg.user + ': ' + msg.msg); 
             io.emit('addChat', msg);
         });
        
        //cycle function
//have list of draft order
//limits are number of players and cap
//get player by id - check number of players and cap
//if they both pass - broadcast id
//if not move to the next owner        
        
        //nominate function
        
        
        //bid function
        socket.on('send bid', function(sentBid){
            console.log(sentBid.bid + ': ' + sentBid.userName);
            Bid.findById(sentBid.bidId).exec(function(err, bidBody) {
                if (err) {
                    return res.send(400, {
                        message: getErrorMessage(err)
                    });
                } else {
                    //validate again
                    
                    
                    bidBody.amount=sentBid.bid;
                    bidBody.owner=sentBid.userId;
                    bidBody.ownerName=sentBid.userName;
                    bidBody.save();
                    io.emit('updateBid',sentBid);
                }
            });  
            
            
        });
        
//        $scope.outBid.bid=$scope.myBid;
//        $scope.outBid.userId=$scope.userId;
//        $scope.outBid.userName=$scope.userName;
        
        
        //draft function
        
    });            
};