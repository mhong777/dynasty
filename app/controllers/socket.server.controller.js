module.exports = function (io) {
    'use strict';
var mongoose = require('mongoose'),
	Owner = mongoose.model('Owner'),
    Player = mongoose.model('Player'),
	Bid = mongoose.model('Bid'),    
	User = mongoose.model('User'),    
    History = mongoose.model('History'),    
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
        GOING ONCE
        *********/
         socket.on('going once', function(){
             io.emit('goingOnceIn', 'Going Once');
         });

        /********
        GOING TWICE
        *********/
         socket.on('going twice', function(){
             io.emit('goingTwiceIn', 'Going Twice');
         });
        
        
        /********
        CYCLE FUNCTION
        *********/
        socket.on('iterate index', function(cycleReq){
            console.log('iterate index');
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
//            var indexList=['53b9dac03391bfbf8a2e3e05', '53b9dac03391bfbf8a2e3e05'];
            var userId='',
                outTest=0,
                indexNum=cycleReq.indexNum,
                numPlayers=0,
                output={},
                totSalary=0;
            
            console.log('indexNum: ' + indexNum);
            
            //change marker for ending the snake
            Bid.findById(cycleReq.bidId).exec(function(err, bidBody) {
                if (err) {
                    return res.send(400, {
                        message: getErrorMessage(err)
                    });
                } else {
                    console.log('change first');
                    bidBody.endAuction=true;
                    bidBody.save();        
                }
            });              
            
            Owner.find().populate('paidPlayer.roster').exec(function(err, owners) {
                if (err) {
                    return res.send(400, {
                        message: getErrorMessage(err)
                    });
                } else {
                    for(var x=0;x<indexList.length;x++){
                        //iterate index
                        if(indexNum>=indexList.length-1){
                            indexNum=0;
                        }
                        else{
                            indexNum++;
                        }
                        //find owner id
                        userId=indexList[indexNum];    
                        console.log('userId: ' + userId);
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
//                                console.log(totSalary);
                                if(totSalary<=314 && numPlayers<22){
                                    //check if the person fits
                                    outTest=1;
//                                    console.log(userId + ': ' + owners[y].name + ' ' + indexNum);
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
                                            console.log('bid');
                                            bidBody.indexNum=indexNum;
                                            bidBody.nomOwner=userId;
                                            bidBody.amount=0;
                                            bidBody.owner=null;
                                            bidBody.player=null;
                                            bidBody.nomStatus=false;
                                            bidBody.endAuction=false;
                                            bidBody.save();
                                            console.log('end Auction: ' + bidBody.endAuction);
                                            io.emit('getIndex',output);
                                        }
                                    });  
                                }
                            }
                        }
                    }
                   Bid.findById(cycleReq.bidId).exec(function(err, bidBody) {
                        if (err) {
                            return res.send(400, {
                                message: getErrorMessage(err)
                            });
                        } else {
                            console.log('bid2: ' + bidBody.endAuction);
                            io.emit('auctionCheck','auctionCheck');
                        }
                    });                                                              
                }                
            });     
            
        });        
        //check the auction
        socket.on('cycle2', function(input){    
            console.log('checkAuction');
            //check if you need to end the draft
            Bid.findById(input.bidId).exec(function(err, bidBody) {
                if (err) {
                    return res.send(400, {
                        message: getErrorMessage(err)
                    });
                } else {
                    console.log(bidBody.endAuction);
                    if(bidBody.endAuction){
                        io.emit('startSnake','end');
                    }
                }
            });             
            
        });         
        
        
        /********
        NOMINATE FUNCTION
        *********/
        socket.on('nominate player', function(nominatedPlayer){
            //update the player nominated
            Bid.findById(nominatedPlayer.bidId).exec(function(err, bidBody) {
//                console.log(bidBody.player + ' ' + nominatedPlayer.playerId);
                if (err) {
                    return res.send(400, {
                        message: getErrorMessage(err)
                    });
                } else {
                    console.log(bidBody.player + ': ' + nominatedPlayer.playerId);
                    bidBody.player=nominatedPlayer.playerId;
                    bidBody.amount=1;
                    bidBody.owner=nominatedPlayer.ownerId;
                    bidBody.nomStatus=true;
                    bidBody.save();
                    var output={};
                    output.ownerId=nominatedPlayer.ownerId;
                    output.ownerName=bidBody.ownerName;
                    
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
                            
                            output.player=player;                            
                            io.emit('updateNominate', output);
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
        socket.on('draft', function(bidId){
            Bid.findById(bidId).exec(function(err, bidBody) {
                if (err) {
                    return res.send(400, {
                        message: getErrorMessage(err)
                    });
                } else {
                    var output={};
                    output.ownerId=bidBody.owner;
                    output.playerId=bidBody.player;
                    output.amount=bidBody.amount;
                    //get player                    
                    //get position of player
                    Player.findById(output.playerId).exec(function(err, player) {
                        if (err) {
                            console.log(err);
                        } else {
//                            console.log(output.amount);
                            //add owner and price
                            player.owner=output.ownerId;
                            var newPrice=[0,0];
                            newPrice[0]=player.price[0];
                            newPrice[1]=output.amount;
                            player.price=newPrice;
                            player.contractYear=0;                            
                            player.save();
                            output.player=player;

                            //get owner and change owner - put player and in and save
                            Owner.findById(output.ownerId).exec(function(err, owner) {
                                if (err) {
                                    console.log(err);
                                } else {
                                    //add him to the paidPlayer list
                                    for(var i=0;i<owner.paidPlayer.length;i++){          
                                        if(owner.paidPlayer[i].name===output.player.position){
                                            //put player on paid list
                                            owner.paidPlayer[i].roster.push(output.player._id);
                                        }
                                    }                                      
                                    owner.save();
                                    io.emit('updateDraft',output);   
                                }
                            });                               
                        }
                    });                     
                }
            });  
        });
        
        /********
        ROOKIE DRAFT FUNCTION
        *********/
        socket.on('draftRookie', function(input){
            //figure out how much the rookie costs
            var value;
            if(input.index<11){
                value=10;
            }
            else{
                value=5;
            }
            //build output
            var output={};
            output.ownerId=input.ownerId;
            output.playerId=input.playerId;
            output.amount=value;                        
            
            //change the player
            Player.findById(output.playerId).exec(function(err, player) {
                if (err) {
                    console.log(err);
                } else {
                    //add owner and price
                    player.owner=input.ownerId;
                    player.available=false;
                    player.unavailable=true;
                    var newPrice=[0,value];
                    player.price=newPrice;
                    player.save();
                    output.player=player;
                    console.log(player.name + ' ' + player.price[1])

                    //get owner and change owner - put player and in and save
                    Owner.findById(input.ownerId).exec(function(err, owner) {
                        if (err) {
                            console.log(err);
                        } else {
                            //add him to the paidPlayer list
                            for(var i=0;i<owner.paidPlayer.length;i++){          
                                if(owner.paidPlayer[i].name===output.player.position){
                                    //put player on paid list
                                    owner.paidPlayer[i].roster.push(output.player._id);
                                }
                            }                                      
                            owner.save();             
                            //send data back
                            io.emit('rookieUpdate',output);                               
                        }
                    });                               
                }
            });              
            //////second output
            //change the bid and rookie nom owner
            //array of rookie draft order
//            var draftOrder=['53b9dac03391bfbf8a2e3e05','53b9dac03391bfbf8a2e3e05'];
            var draftOrder=['53b9dac03391bfbf8a2e3e28', 
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
            
            //add one to the index
            var output2={};
            var newIndex=input.index+1;
            var newOwner;
            output.index=newIndex;
            if(newIndex>draftOrder.length-1){
                //end the rookie draft
                io.emit('endRookie');
                //start the auction
                
            }
            else{
                newOwner=draftOrder[newIndex];                
                output2.index=newIndex;
                
                //modify bid
                Bid.findById(input.bidId).exec(function(err, bidBody) {
                    if (err) {
                        return res.send(400, {
                            message: getErrorMessage(err)
                        });
                    } else {
                        bidBody.rookieDraftIndex=newIndex;
                        bidBody.rookieNomOwner=newOwner;
                        bidBody.save();                                                                                        
                    }
                });                    
                
                //get the owner
                Owner.findById(newOwner).exec(function(err, owner) {
                    if (err) {
                        return res.send(400, {
                            message: getErrorMessage(err)
                        });
                    } else {
                        output2.nomOwner=owner;
                        //send data back
                        io.emit('rookieCycle',output2);
                    }
                });                  
                
                                
            }
        });    

        /********
        SNAKE DRAFT FUNCTION
        *********/
        socket.on('draftSnake', function(input){
            //build output
            var output={};
            output.ownerId=input.ownerId;
            output.playerId=input.playerId;
            output.amount=1;                        
            //change the player
            Player.findById(output.playerId).exec(function(err, player) {
                if (err) {
                    console.log(err);
                } else {
                    console.log(input.ownerId);
                    //add owner and price
                    player.owner=input.ownerId;
                    player.available=false;
                    player.unavailable=true;
                    player.contractYear=0;
                    var newPrice=player.price;
                    newPrice[1]=1;
                    player.price=newPrice;
                    player.save();
                    output.player=player;

                    //get owner and change owner - put player and in and save
                    Owner.findById(input.ownerId).exec(function(err, owner) {
                        if (err) {
                            console.log(err);
                        } else {
                            //add him to the paidPlayer list
                            for(var i=0;i<owner.paidPlayer.length;i++){          
                                if(owner.paidPlayer[i].name===output.player.position){
                                    //put player on paid list
                                    owner.paidPlayer[i].roster.push(output.player._id);
                                }
                            }                                      
                            owner.save();
                            console.log('draft went through');
                            //send data back
                            io.emit('snakeUpdate',output);                               
                        }
                    });                               
                }
            });
        });
        socket.on('draftSnake2', function(input){
            console.log('draftSnake2');
            //////second output
            //change the bid and rookie nom owner
            //array of rookie draft order
//            var indexList=['53b9dac03391bfbf8a2e3e05','53b9dac03391bfbf8a2e3e05'];
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
            //add one to the index
            var output2={};            
            var indexNum=input.index;
            
            //change marker for ending the snake
            Bid.findById(input.bidId).exec(function(err, bidBody) {
                if (err) {
                    return res.send(400, {
                        message: getErrorMessage(err)
                    });
                } else {
                    bidBody.endSnake=true;
                    bidBody.save();        
                }
            });              
            
            Owner.find().populate('paidPlayer.roster').exec(function(err, owners) {
                if (err) {
                    return res.send(400, {
                        message: getErrorMessage(err)
                    });
                } else {
                    for(var x=0;x<indexList.length;x++){
                        //iterate index
                        if(indexNum>=indexList.length-1){
                            indexNum=0;
                        }
                        else{
                            indexNum++;
                        }
                        //find owner id
                        var userId=indexList[indexNum];  
                        var totSalary,
                            numPlayers;
                        //get the owner
                        for(var y=0;y<owners.length;y++){
                            if(userId==owners[y]._id){                                                                
                                
                                //calculate the salary and number of players
                                numPlayers=0;
                                for(var i=0; i<owners[y].paidPlayer.length;i++){
                                    numPlayers+=owners[y].paidPlayer[i].roster.length
                                }
                                console.log('numPlayers: ' + numPlayers);
                                if(numPlayers<22){
                                    //check if the person fits
                                    output2.index=indexNum;
                                    output2.nomOwner=owners[y];
                                    
                                    //save the bid index
                                    Bid.findById(input.bidId).exec(function(err, bidBody) {
                                        if (err) {
                                            return res.send(400, {
                                                message: getErrorMessage(err)
                                            });
                                        } else {
                                            bidBody.snakeDraftIndex=indexNum;
                                            bidBody.snakeNomOwner=output2.nomOwner._id;  
                                            bidBody.endSnake=false;
                                            bidBody.save();        
                                            console.log('drafted' + ' ' + bidBody.endSnake);
                                            io.emit('snakeCycle',output2);
                                        }
                                    });  
                                }
                            }
                        }
                    }
                }
                io.emit('snakeCheck','snakeCheck'); 
            });  
            
        });
        socket.on('draftSnake3', function(input){    
            //check if you need to end the draft
            Bid.findById(input.bidId).exec(function(err, bidBody) {
                if (err) {
                    return res.send(400, {
                        message: getErrorMessage(err)
                    });
                } else {
                    console.log(bidBody.endSnake);
                    if(bidBody.endSnake){
                        io.emit('endSnake','end');
                    }
                }
            });             
            
        });            
        //build snake draft
        //build the signal to end of rookie draft and snake draft
        
        //build the going going gone
        
        socket.on('rookie1', function(input){
            console.log(input); 
            io.emit('startRookie', 'rookie');
        });          

        /********
        PRE DRAFT ALL OFF
        *********/                    
         socket.on('preDraft', function(bidId){
            //save the bid index
            Bid.findById(bidId).exec(function(err, bidBody) {
                if (err) {
                    return res.send(400, {
                        message: getErrorMessage(err)
                    });
                } else {
                    bidBody.rookieDraft=false;
                    bidBody.auctionDraft=false;
                    bidBody.snakeDraft=false;
                    bidBody.save();                                                                                        
                }
            });               
             io.emit('allOff', 'off');
         }); 
        
        /********
        START ROOKIE
        *********/                    
         socket.on('activateRookie', function(bidId){
            //save the bid index
            Bid.findById(bidId).exec(function(err, bidBody) {
                if (err) {
                    return res.send(400, {
                        message: getErrorMessage(err)
                    });
                } else {
                    bidBody.rookieDraft=true;
                    bidBody.auctionDraft=false;
                    bidBody.snakeDraft=false;
                    bidBody.save();                                                                                        
                }
            });               
             io.emit('startRookie', 'rookie');
         });         

        /********
        START AUCTION
        *********/                    
         socket.on('activateAuction', function(bidId){
            //save the bid index
            Bid.findById(bidId).exec(function(err, bidBody) {
                if (err) {
                    return res.send(400, {
                        message: getErrorMessage(err)
                    });
                } else {
                    bidBody.rookieDraft=false;
                    bidBody.auctionDraft=true;
                    bidBody.snakeDraft=false;
                    bidBody.save();                                                                                        
                }
            });               
             io.emit('startAuction', 'auction');
         });          
        
        /********
        END AUCTION
        *********/
         socket.on('end auction draft', function(bidId){
             console.log('end auction draft');
            //save the bid index
            Bid.findById(bidId).exec(function(err, bidBody) {
                if (err) {
                    return res.send(400, {
                        message: getErrorMessage(err)
                    });
                } else {
                    bidBody.rookieDraft=false;
                    bidBody.auctionDraft=false;
                    bidBody.snakeDraft=true;
                    bidBody.save();                                                                                        
                }
            });               
             io.emit('endAuction', 'end');
         });
        
        
      /*******
      ADMIN RESET BID TO START
      *******/
    socket.on('resetBid', function(bidId){
        //save the bid index
        Bid.findById(bidId).exec(function(err, bidBody) {
            if (err) {
                console.log(getErrorMessage(err));
            } else {
                bidBody.amount=0;
                bidBody.owner=null;
                bidBody.player=null;
                bidBody.nomStatus=false;
                
                bidBody.rookieDraft='true';
                bidBody.auctionDraft='false';
                bidBody.snakeDraft='false';
                
                bidBody.endAuction='false';
                bidBody.endSnake='false';
                
                bidBody.rookieDraftIndex=0;
                bidBody.snakeDraftIndex=0;
                bidBody.indexNum=0;
                
                bidBody.rookieNomOwner='53b9dac03391bfbf8a2e3e28';
                bidBody.snakeNomOwner='53b9dac03391bfbf8a2e3e28';
                bidBody.nomOwner='53b9dac03391bfbf8a2e3e28';
                bidBody.save();
                console.log(bidBody.player);
            }
        });      
        
//        var history;
//        History.find().sort('-created').exec(function(err, histories) {
//            if (err) {
//                console.log(getErrorMessage(err));
//            } else {
//                for(var x=0; x<histories.length;x++){
//                    history=histories[x];
//                    history.remove(function(err) {
//                        if (err) {
//                            console.log(getErrorMessage(err));
//                        } else {
//                            
//                        }
//                    });                
//                }
//            }
//	   });                        
        
    });


    /*******check add in the history
    *****/
    socket.on('addHistory', function(input){
        var history = new History(input);
        history.user = '53b9dac03391bfbf8a2e3e05';

        history.save(function(err) {
            if (err) {
                console.log(getErrorMessage(err));
            } else {                    
                io.emit('addLocalHistory', history);
                console.log(history.amount);
            }
        });

    });
        
        
    /****
    CHANGE INDEX
    ****/
    socket.on('changeIndex', function(input){
        //save the bid index
        Bid.findById(input.bidId).exec(function(err, bidBody) {
            if (err) {
                console.log(getErrorMessage(err));
            } else {
                if(input.edraftType==='rookie'){
                    //rookie
                    bidBody.rookieDraftIndex=input.index;
                    bidBody.rookieNomOwner=input.ownerId;
                    console.log('rookie');                    
                }
                else if(input.edraftType==='auction'){
                    //auction
                    bidBody.amount=0;
                    bidBody.owner=null;
                    bidBody.player=null;
                    bidBody.nomStatus=false;
                    bidBody.endAuction='false';
                    bidBody.indexNum=input.index;
                    bidBody.nomOwner=input.ownerId;
                    console.log('auction');                    
                }
                else if(input.edraftType==='snake'){
                    //snake
                    bidBody.endSnake='false';
                    bidBody.snakeDraftIndex=input.index;
                    bidBody.snakeNomOwner=input.ownerId;
                    console.log('snake');
                }
                bidBody.save();
                console.log('changed');
                io.emit('changeLocalIndex', 'bids');
            }
        });             
        //populate and send back
//        Bid.find().sort('-created').populate('owner', 'name').populate('player').populate('rookieNomOwner','name').populate('snakeNomOwner','name').populate('nomOwner','name').exec(function(err, bids) {
//            if (err) {
//                console.log(getErrorMessage(err));
//            } else {
//                console.log('sent bid back');
//                io.emit('changeLocalIndex', bids);
//            }
//	    });        
    });
        
        
        
        /*****
        ADD PLAYER
        *******/
        socket.on('addPlayer', function(input){
            io.emit('addPlayerList', input); 
        });
        
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