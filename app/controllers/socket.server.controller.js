module.exports = function (io) {
    'use strict';
var mongoose = require('mongoose'),
	Owner = mongoose.model('Owner'),
    Player = mongoose.model('Player'),
	Bid = mongoose.model('Bid'),    
	User = mongoose.model('User'),    
	_ = require('lodash');
    
    
    io.on('connection', function(socket){
        socket.broadcast.emit('user connected');
        
        /********
        CHAT FUNCTION
        *********/
         socket.on('send msg', function(msg){
            console.log(msg.user + ': ' + msg.msg); 
             io.emit('addChat', msg);
         });
        
        /********
        CYCLE FUNCTION
        *********/
        socket.on('iterate index', function(cycleReq){
//owner
//{ "_id" : ObjectId("53b9dac03391bfbf8a2e3e28"), "name" : "FrederickGriefer" }
//{ "_id" : ObjectId("53b9dac03391bfbf8a2e3e13"), "name" : "GiovanniPindilli" }
//{ "_id" : ObjectId("53b9dac03391bfbf8a2e3e0c"), "name" : "ChristinaKang" }
//{ "_id" : ObjectId("53b9dac03391bfbf8a2e3e4b"), "name" : "RossBramlet" }
//{ "_id" : ObjectId("53b9dac03391bfbf8a2e3e44"), "name" : "DavidMilliner" }
//{ "_id" : ObjectId("53b9dac03391bfbf8a2e3e3d"), "name" : "NishNarenchania" }
//{ "_id" : ObjectId("53b9dac03391bfbf8a2e3e1a"), "name" : "JessicaDorn" }
//{ "_id" : ObjectId("53b9dac03391bfbf8a2e3e21"), "name" : "MarkHansberger" }
//{ "_id" : ObjectId("53b9dac03391bfbf8a2e3e05"), "name" : "MichaelHong" }
//{ "_id" : ObjectId("53b9dac03391bfbf8a2e3e2f"), "name" : "GregFlowers" }
//{ "_id" : ObjectId("53b9dac03391bfbf8a2e3dfe"), "name" : "MichaelRamos" }
//{ "_id" : ObjectId("53b9dac03391bfbf8a2e3e36"), "name" : "KevinQuencer" }

            
            
            var indexList=['53b9dac03391bfbf8a2e3e28', 
                               '53b9dac03391bfbf8a2e3e13', 
                               '53b9dac03391bfbf8a2e3e0c', 
                               '53b9dac03391bfbf8a2e3e4b', 
                               '53b9dac03391bfbf8a2e3e44', 
                               '53b9dac03391bfbf8a2e3e3d', 
                               '53b9dac03391bfbf8a2e3e1a', 
                               '53b9dac03391bfbf8a2e3e21', 
                               '53b9dac03391bfbf8a2e3e05', 
                               '53b9dac03391bfbf8a2e3e2f', 
                               '53b9dac03391bfbf8a2e3dfe', 
                               '53b9dac03391bfbf8a2e3e36'];    
            var userId='',
                outTest=0,
                indexNum=cycleReq.indexNum,
                numPlayers=0,
                output={},
                totSalary=0;
            
            Owner.find().populate('paidPlayer.roster').exec(function(err, owners) {
                if (err) {
                    return res.send(400, {
                        message: getErrorMessage(err)
                    });
                } else {
                    for(var x=0;x<indexList.length;x++){
                        //iterate index
                        if(indexNum===11){
                            indexNum=0;
                        }
                        else{
                            indexNum++;
                        }
                        //find owner id
                        userId=indexList[indexNum];    
                        //get the owner
                        for(var y=0;y<owners.length;y++){
                            if(userId==owners[y]._id){                                                                
                                
                                //calculate the salary and number of players
                                totSalary=0;
                                numPlayers=0;
                                for(var i=0; i<owners[y].paidPlayer.length;i++){
                                    for(var j=0; j<owners[y].paidPlayer[i].roster.length;j++){
                                        totSalary+=owners[y].paidPlayer[i].roster[j].price[1];
                                        numPlayers++;
                                    }                
                                }
                                totSalary+=owners[y].additionalCap;
                                                                                                
                                if(totSalary<=315 && numPlayers<22){
                                    //check if the person fits
                                    outTest=1;
                                    console.log(userId + ': ' + owners[y].name + ' ' + indexNum);
                                    console.log(totSalary + ': ' + numPlayers);    
                                    output.indexNum=indexNum;
                                    output.owner=owners[y];
                                    
                                    //save the bid index
                                    Bid.findById(cycleReq.bidId).exec(function(err, bidBody) {
                                        if (err) {
                                            return res.send(400, {
                                                message: getErrorMessage(err)
                                            });
                                        } else {
                                            bidBody.indexNum=indexNum;
                                            bidBody.save();
//                                            console.log(cycleReq.indexNum);
                                             io.emit('getIndex',output);                    
                                        }
                                    });  
                                    
                                    
                                }
                            }
                        }
                        if(outTest===1){
                            break;
                        }                        
                    }
                }
            });                
            
            
            
            
            if(outTest===0){
                io.emit('testOut', 'second');    
            }
            
            
            
            
            
            
            
//                    bidBody.indexNum=cycleReq.indexNum;
//                    bidBody.save();
//                    console.log(cycleReq.indexNum);
//                     io.emit('getIndex',cycleReq);  
            
            
//        if($scope.user===$scope.authentication.user.ownerId){
//            if($scope.maxSalary>=1 && 22-$scope.totalPlayers($scope.myOwner)>0){
//                $scope.bids[0].indexNum=nextUser.indexNum;
//                $scope.nomBool=true;
//                $scope.$digest();
//                console.log('1');                        
//            }
//            else if(nextUser.Num===11){
//                //end draft   
//                console.log('2');
//            }
//            else if(nextUser.indexNum===11){
//                //reset the draft
//                console.log('3');
//                nextUser.indexNum=0;
////                socket.emit('iterate index',nextUser);              
//            }            
//            else{
//                console.log('4');
//                nextUser.indexNum++;
////                socket.emit('iterate index',nextUser);              
//            }                
//        }
//        else{
//            console.log('5');
//            nextUser=false;
//        }                     
            
            
            
                        
        });
        
        
//have list of draft order
//limits are number of players and cap
//get player by id - check number of players and cap
//if they both pass - broadcast id
//if not move to the next owner        
        
        /********
        NOMINATE FUNCTION
        *********/
        socket.on('nominate player', function(nominatedPlayer){
            //update the player nominated
            Bid.findById(nominatedPlayer.bidId).exec(function(err, bidBody) {
                if (err) {
                    return res.send(400, {
                        message: getErrorMessage(err)
                    });
                } else {
                    bidBody.player=nominatedPlayer.playerId;
                    bidBody.save();
                    
                    //get player nominated
                    Player.findById(nominatedPlayer.playerId).exec(function(err, player) {
                        if (err) {
                            console.log(err);
                        } else {
                            //change the status of the player and save
                            player.available=false;
                            player.unavailable=true;
                            console.log(player.name);
                            player.save();
                            
                            
                            //send back the name of the player and id
                            //get player's name
                            //send back the name of the player
                            
                            io.emit('updateNominate', player);
                        }
                    }); 
                }
            });  
        });
        
        /********
        BID FUNCTION
        *********/
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
        

        /********
        DRAFT FUNCTION
        *********/
        
        /********
        ADMIN ADD OWNER FUNCTION
        *********/
        socket.on('add owners', function(bothArrays){
            var ownerId=bothArrays.ownerId;
            var userId=bothArrays.userId;
            //get user
            User.findById(userId).exec(function(err, user) {

                if (err) {
                    console.log(getErrorMessage(err));                        
                } else {
                    user.ownerId=ownerId;
                    user.save();
                    console.log(user.ownerId + ' ' + user.displayName + ': ' + ownerId);
                }
            });                                   
        });
        
        
        
    });            
};