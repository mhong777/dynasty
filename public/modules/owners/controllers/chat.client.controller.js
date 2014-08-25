'use strict';

angular.module('owners').controller('ChatController', ['$scope', '$stateParams', '$location', 'Authentication', 'Owners', '$http', 'socket', 'Bids', 'Histories',
function($scope, $stateParams, $location, Authentication, Owners, $http, socket, Bids, Histories ) {
    $scope.init=function(){
        /*******
        INITIALIZE VALUES
        ******/
        
        $scope.msgs=[];
        $scope.adminMsg='';        
        $scope.newMsg='';
        $scope.outBid={};
        $scope.emitMsg={};
        $scope.authentication = Authentication;
        $scope.userName=$scope.authentication.user.displayName;                
        $scope.userId=$scope.authentication.user.ownerId;        
        $scope.myBid=0;
        $scope.minBid=0;
        $scope.maxBid=0;
        $scope.nomError='';
        $scope.maxSalary=315;
        $scope.maxPlayers=22;
        $scope.nomPlayer={};
        $scope.endMsg='';
        $scope.bidError='';
        
        $scope.adminShow=function(){
            if($scope.userId==='53b9dac03391bfbf8a2e3dfe' || $scope.userId==='53b9dac03391bfbf8a2e3e05'){
                return true;
            }
            else{
                return false;
            }
        };        
        
        /******
        GET ALL DATA
        ******/
		// Find a list of Owners
        $http.get('/draftList').
            success(function(data, status){
                $scope.owners=data;
                /****
                FIND YOUR ROSTER
                ***/
                for(var x=0; x<$scope.owners.length; x++){
//                    console.log(x + $scope.owners[x].ownerId);
                    if($scope.owners[x]._id===$scope.userId){
//                        console.log('works');
                        //initialize myOwner
                        $scope.myOwner=$scope.owners[x];
                        $scope.displayOwner=$scope.myOwner;
                        
                        /******
                        OWNER FUNCTIONS
                        ******/
                        $scope.capCalulate = function(owner){
                            var totSalary=0;
                            for(var i=0; i<owner.paidPlayer.length;i++){
                                for(var y=0; y<owner.paidPlayer[i].roster.length;y++){
                                    totSalary+=owner.paidPlayer[i].roster[y].price[1];    
                                }                
                            }
                            totSalary+=owner.additionalCap;                
                            return $scope.maxSalary-totSalary;
                        };
                        
                        //get initial total players
                        $scope.totalPlayers = function(owner){
                            var totPlayer=0;
                            for(var i=0; i<owner.paidPlayer.length;i++){
                                totPlayer+=owner.paidPlayer[i].roster.length;
                            }
                            return totPlayer;
                        };                      
                        
                        /*****
                        INITIALIZE VALUES
                        *****/
                        $scope.myCap = function(){
                            var totSalary=0;
                            for(var i=0; i<$scope.myOwner.paidPlayer.length;i++){
                                for(var y=0; y<$scope.myOwner.paidPlayer[i].roster.length;y++){
                                    totSalary+=$scope.myOwner.paidPlayer[i].roster[y].price[1];    
                                }                
                            }
                            totSalary+=$scope.myOwner.additionalCap;                
                            return $scope.maxSalary-totSalary;
                        };
                        $scope.mySlots = function(){
                            var totPlayer=0;
                            for(var i=0; i<$scope.myOwner.paidPlayer.length;i++){
                                totPlayer+=$scope.myOwner.paidPlayer[i].roster.length;
                            }
                            return $scope.maxPlayers-totPlayer;
                        };                                     
                        break;
                    }
                }
                // Find a list of Bid Status
                $http.get('/bids').
                    success(function(data, status){
                        $scope.bids=data;              
                        $scope.currentBid=$scope.bids[0].amount;
                        $scope.indexNum=$scope.bids[0].indexNum;
                        if($scope.bids[0].owner){
                            $scope.currentBidder=$scope.bids[0].owner.name;    
                        }
                        else{
                            $scope.currentBidder='';
                        }                
                        //set player being bid on
                        if($scope.bids[0].player){
                            $scope.nomPlayer=$scope.bids[0].player;
                        }
                        else{
                            $scope.nomPlayer='Nominated Player';
                        }
                        //set min bid
                        if($scope.bids[0].amount>0){
                            $scope.minBid=$scope.bids[0].amount+1;
                        }
                        /*******
                        FUNCTIONS
                        ******/                
                        //figure out if you are allowed to draft
                        $scope.draftEligable=function(){
//                            console.log($scope.myCap() + ' ' + $scope.mySlots())
                            if($scope.myCap()>=1 && $scope.mySlots()>0 && $scope.bids[0].auctionDraft){
                                return true;
                            }  
                            else{
        //                        console.log('false');
                                return false;
                            }
                        };                   
                        //figure out if you are allowed to nominate a player
                        $scope.nomBool=function(){
                            if($scope.draftEligable() && $scope.bids[0].nomOwner._id===$scope.authentication.user.ownerId && !$scope.bids[0].nomStatus && $scope.bids[0].auctionDraft){
                                return true;
                            }  
                            else{
                                return false;
                            }
                        };                     
                        //figure out if you are allowed to draft the rookie
                        $scope.rookieBool=function(){
                            if($scope.bids[0].rookieDraft && $scope.bids[0].rookieNomOwner._id===$scope.authentication.user.ownerId){
                                return true;
                            }
                            else{
                                return false;
                            }
                        };
                        //figure out if you are allowed to draft the rookie
                        $scope.snakeBool=function(available){
                            if($scope.bids[0].snakeDraft && $scope.bids[0].snakeNomOwner._id===$scope.authentication.user.ownerId){
                                return true;
                            }
                            else{
                                return false;
                            }
                        };
                        //button bools
                        $scope.rookieButtonBool=function(rookie, available){
                            if(rookie && available){
                                return true;
                            }
                            else{
                                return false;
                            }
                        };
                        $scope.drafting=function(owner){
                            if($scope.bids[0].rookieDraft){
                                if($scope.bids[0].rookieNomOwner._id===owner._id){
                                    return true;
                                }
                                else{
                                    return false;
                                }
                            }
                            else if($scope.bids[0].auctionDraft){
                                if($scope.bids[0].nomOwner._id===owner._id){
                                    return true;
                                }
                                else{
                                    return false;
                                }
                            }
                            else{
                                if($scope.bids[0].snakeNomOwner._id===owner._id){
                                    return true;
                                }
                                else{
                                    return false;
                                }
                            }
                        }
                    });                    
            });             
		// Find a list of Players
        $http.get('/players').
            success(function(data, status){
                $scope.players=data;
                $scope.filters={};
                $scope.filters.position='';
                $scope.availableString='All Players';
                $scope.filters.available=true;
                $scope.availableString='Free Agents';        
                
            });             
  		// Find History
        $http.get('/histories').
            success(function(data, status){
                $scope.history=data;
            });  
    };//end initi function
    $scope.init();



    
 
    
    //figure out if you are in the snake draft
    
    
    /*******
    FOR SORTING
    ******/
    $scope.positionList=function(player){
        if(player.position==='QB'){
            return 1;
        }
        else if(player.position==='WR'){
            return 2;
        }
        else if(player.position==='RB'){
            return 3;
        }
        else if(player.position==='TE'){
            return 4;
        }
        else if(player.position==='K'){
            return 5;
        }
        else{
            return 6;
        }
    };    
    
    $scope.ownerPositionList=function(position){
        if(position.name==='QB'){
            return 1;
        }
        else if(position.name==='WR'){
            return 2;
        }
        else if(position.name==='RB'){
            return 3;
        }
        else if(position.name==='TE'){
            return 4;
        }
        else if(position.name==='K'){
            return 5;
        }
        else{
            return 6;
        }
    };    
    
    $scope.rank=function(player){
        return player.startRank.absRank[1];
    };

    /*******
    *FOR FILTERS
    *******/
    $scope.changeAvailable=function(value){
        if(value===1){
            $scope.filters.available='';
            $scope.availableString='All Players';
            return;
        }  
        else if(value ===2){
            $scope.filters.available=true;
            $scope.availableString='Free Agents';
            return;                
        }
        else{
            $scope.filters.available=false;
            $scope.availableString='Currently Owned';
            return;                
        }
    };

    //filter by position
    $scope.addFilter=function(position){
        $scope.filters.position.push(position);  
    };

    $scope.listFilter = function (position, available) {
        return function (list) {
//                console.log(list.available);
//                console.log(available);
            if(list.available===available || available===''){
                return list.position.match(position);                     
            }
//                    && list.available.match(available);
        };
    };        

    /***************
    ADMIN FUNCTION
    ***************/
    $scope.makeInitialBid=function(){
        var bid = new Bids({
            name: 'bid',
            amount: 0
        });


        bid.$save(function(response) {
            console.log(bid.amount + ',' + response._id);
            //$location.path('players/' + response._id);
        }, function(errorResponse) {
            $scope.error = errorResponse.data.message;
            console.log($scope.error);
        });        
    };        
    
    //ASSOCIATE USERS WITH OWNERS
    $scope.addOwners=function(){
        $scope.userArray=['53b88fdf248d1c4d7f9226c7', '53b88f36248d1c4d7f9226c3', '53b88f5f248d1c4d7f9226c4', '53b8903c248d1c4d7f9226ca', '53b8907a248d1c4d7f9226cc', '53b8905d248d1c4d7f9226cb', '53b88f9d248d1c4d7f9226c5', '53b88fbd248d1c4d7f9226c6', '53aa16f715280e0f07029dd9', '53b88ff9248d1c4d7f9226c8', '53b88ece248d1c4d7f9226c2', '53b8901b248d1c4d7f9226c9'];
        $scope.ownerArray=['53b9dac03391bfbf8a2e3e28', 
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
        
        $scope.bothArrays={};
        $scope.bothArrays.userArray=$scope.userArray;
        $scope.bothArrays.ownerArray=$scope.ownerArray;
//        console.log($scope.bothArrays);
        for(var x=0; x<$scope.userArray.length;x++){
            $scope.bothArrays.userId=$scope.userArray[x];
            $scope.bothArrays.ownerId=$scope.ownerArray[x];
            socket.emit('add owners', $scope.bothArrays);    
        }
    };
    
    $scope.resetBid=function(){
        socket.emit('resetBid', $scope.bids[0]._id);  
    };

    /*****
    CHAT FUNCTION
    ****/
    //send chat function
    $scope.sendMsg=function(){
        $scope.emitMsg.user=$scope.userName; 
        $scope.emitMsg.msg=$scope.newMsg;
        socket.emit('send msg', $scope.emitMsg);
        $scope.newMsg='';
    };
    
    //recieve chat function
    socket.on('addChat', function(addMsg){
//        console.log(addMsg);
        $scope.msgs.push(addMsg);
//        console.log($scope.msgs);
        $scope.$digest();
    });
    
    
    //NEED TO BE ABLE TO JUST ADD HTML
    /*****
    GOING ONCE
    ****/
    //send chat function
    $scope.goingOnce=function(){
        socket.emit('going once');
    };
    
    //recieve chat function
    socket.on('goingOnceIn', function(addMsg){
        $scope.adminMsg=addMsg;
        $scope.$digest();
    });
    
    /*****
    GOING TWICE
    ****/
    //send chat function
    $scope.goingTwice=function(){
        socket.emit('going twice');
    };
    
    //recieve chat function
    socket.on('goingTwiceIn', function(addMsg){
        $scope.adminMsg=addMsg;
        $scope.$digest();
    });
    
    
    
    /********
    CYCLE FUNCTION
    ********/
    $scope.iterateIndex=function(){
        $scope.cycleReq={};
        $scope.cycleReq.bidId=$scope.bids[0]._id;
        $scope.cycleReq.indexNum=$scope.indexNum;
//        console.log($scope.cycleReq);
        socket.emit('iterate index',$scope.cycleReq);          
    };
    
    //get cycle index
    socket.on('getIndex', function(nextUser){
        $scope.minBid=0;
        $scope.nomPlayer={};

        $scope.indexNum=nextUser.indexNum;
        $scope.bids[0].indexNum=nextUser.indexNum;
        $scope.bids[0].nomOwner._id=nextUser.owner._id;         

        $scope.$digest();
//        console.log(nextUser);
    });
    //check if auction is going on still
    socket.on('auctionCheck', function(input){
        $scope.input={};
        $scope.input.bidId=$scope.bids[0]._id;
        socket.emit('cycle2', $scope.input);        
    });
    
        
    
    /*******
    NOMINATE
    *******/
    $scope.nominate=function(playerId, available){
        if(available){
            $scope.nomPlayer={};
            $scope.nomPlayer.bidId=$scope.bids[0]._id;
            $scope.nomPlayer.playerId=playerId;
            $scope.nomPlayer.ownerId=$scope.userId;
            $scope.nomPlayer.ownerName=$scope.userName;
//            console.log($scope.nomPlayer);
            socket.emit('nominate player', $scope.nomPlayer);            
            $scope.nomError='';
        }  
        else{
            $scope.nomError='player is not available';
        }
    };
    //get nominated player
    socket.on('updateNominate', function(output){
        //update the player in the list
        for(var x=0;x<$scope.players.length;x++){
            if(output.player._id===$scope.players[x]._id){
                $scope.players[x].available=false;
                $scope.players[x].unavailable=true;
                break;
            }
        }
        //update the nom 
        $scope.nomPlayer=output.player;
        $scope.currentBid=1;
        $scope.minBid=2;
        $scope.currentBidder=output.ownerName;
        $scope.bids[0].nomStatus=true;        
        $scope.$digest();
//        console.log(player); 
    });
    
    /*******
    ROOKIE DRAFT
    *******/
    $scope.draftRookie=function(playerId, available){
        if(available){
            $scope.input={};
            $scope.input.bidId=$scope.bids[0]._id;
            $scope.input.playerId=playerId;
            $scope.input.ownerId=$scope.userId;
            $scope.input.index=$scope.bids[0].rookieDraftIndex;
            $scope.input.ownerName=$scope.userName;            
            socket.emit('draftRookie', $scope.input);            
        }  
        else{
            $scope.nomError='player is not available';
        }
    };    
    //get draft result
    socket.on('rookieUpdate', function(input){
        //update the owner
        //continue auction
        for(var x=0;x<$scope.owners.length;x++){
            if($scope.owners[x]._id===input.ownerId){
//                console.log($scope.owners[x].paidPlayer.length);

                for(var y=0;y<$scope.owners[x].paidPlayer.length;y++){
//                    console.log($scope.owners[x].paidPlayer[y]);
                    if($scope.owners[x].paidPlayer[y].name===input.player.position){
//                        console.log('2');
                        //push player in
                        $scope.owners[x].paidPlayer[y].roster.push(input.player);
                        if(input.ownerId===$scope.myOwner._id){
//                            console.log('3');
                            $scope.myOwner=$scope.owners[x];
//                            $scope.myCap=$scope.capCalulate($scope.myOwner);
//                            $scope.maxBid=$scope.myCap;
                        }
                        break;
                    }
                }
            }
        }            
        //update player to make them unavailable
        for(var x=0;x<$scope.players.length;x++){
            if(input.player._id===$scope.players[x]._id){
                $scope.players[x].available=false;
                $scope.players[x].unavailable=true;
                break;
            }
        }                
        $scope.$digest();

        var historyInput={};
        historyInput.playerName=input.player.name;
        historyInput.playerId=input.player._id;
        historyInput.ownerId=input.ownerId;
        historyInput.amount=input.player.price[1];
        $scope.addHistory(historyInput);        
//        $scope.iterateIndex(); 
    });    
    
    //cycle rookie
    socket.on('rookieCycle', function(input){
        //update the bid
//        console.log(input);
        $scope.bids[0].rookieDraftIndex=input.index;
        $scope.bids[0].rookieNomOwner._id=input.nomOwner._id;
        $scope.bids[0].rookieNomOwner.name=input.nomOwner.name;
        $scope.$digest();
    });
    
    //end rookie
    socket.on('endRookie', function(){
        socket.emit('activateAuction', $scope.bids[0]._id);
    });
    
    /*******
    SNAKE DRAFT
    *******/
    $scope.draftSnake=function(playerId, available){
        if(available){
            $scope.input={};
            $scope.input.bidId=$scope.bids[0]._id;
            $scope.input.playerId=playerId;
            $scope.input.ownerId=$scope.userId;
            $scope.input.index=$scope.bids[0].rookieDraftIndex;
            $scope.input.ownerName=$scope.userName;
            socket.emit('draftSnake', $scope.input);            
        }  
        else{
            $scope.nomError='player is not available';
        }
    }; 
    
    //update from snake draft
    socket.on('snakeUpdate', function(input){
        //update the owner
        //continue auction
        for(var x=0;x<$scope.owners.length;x++){
            if($scope.owners[x]._id===input.ownerId){
//                console.log($scope.owners[x].paidPlayer.length);

                for(var y=0;y<$scope.owners[x].paidPlayer.length;y++){
//                    console.log($scope.owners[x].paidPlayer[y]);
                    if($scope.owners[x].paidPlayer[y].name===input.player.position){
//                        console.log('2');
                        //push player in
                        $scope.owners[x].paidPlayer[y].roster.push(input.player);
                        if(input.ownerId===$scope.myOwner._id){
//                            console.log('3');
                            $scope.myOwner=$scope.owners[x];
//                            $scope.myCap=$scope.capCalulate($scope.myOwner);
//                            $scope.maxBid=$scope.myCap;
                        }
                        break;
                    }
                }
            }
        }            
        //update player to make them unavailable
        for(var x=0;x<$scope.players.length;x++){
            if(input.player._id===$scope.players[x]._id){
                $scope.players[x].available=false;
                $scope.players[x].unavailable=true;
                break;
            }
        }                
        $scope.$digest();        
        $scope.input={};
        $scope.input.bidId=$scope.bids[0]._id;
        $scope.input.index=$scope.bids[0].rookieDraftIndex;
        socket.emit('draftSnake2', $scope.input);          
        
        var historyInput={};
        historyInput.playerName=input.player.name;
        historyInput.playerId=input.player._id;
        historyInput.ownerId=input.ownerId;
        historyInput.amount=input.player.price[1];
        $scope.addHistory(historyInput);        
        
//        $scope.iterateIndex(); 
    });      
    
    //cycle snake
    socket.on('snakeCycle', function(input){
        //update the bid
//        console.log(input);
        $scope.bids[0].snakeDraftIndex=input.index;
        $scope.bids[0].snakeNomOwner._id=input.nomOwner._id;
        $scope.bids[0].snakeNomOwner.name=input.nomOwner.name;
        $scope.$digest();
    });    
    
    //check end snake
    socket.on('snakeCheck', function(input){
        //update the bid
//        console.log(input);
        $scope.input={};
        $scope.input.bidId=$scope.bids[0]._id;
        socket.emit('draftSnake3', $scope.input);                    
    });    
    
    
    
    //end snake
    socket.on('endSnake', function(msg){
        $scope.bids[0].rookieDraft=false;
        $scope.bids[0].auctionDraft=false;
        $scope.bids[0].snakeDraft=false;
        $scope.endMsg='The Draft has Ended. Good Luck!';
        $scope.$digest();        
    });    
    
    /*****
    BID FUNCTION
    ****/
    //send bid function
    $scope.submitBid=function(){
        //add validation of bid
//        console.log($scope.myBid + ' ' + $scope.minBid + ' ' + $scope.myCap);
        if($scope.myBid>=$scope.minBid && $scope.myBid<=$scope.myCap() && $scope.bids[0].nomStatus){
            $scope.outBid.bidId=$scope.bids[0]._id;
            $scope.outBid.bid=$scope.myBid;
            $scope.outBid.userId=$scope.userId;
            $scope.outBid.userName=$scope.userName;
            socket.emit('send bid', $scope.outBid);            
        }
        else{
            $scope.bidError='Try Again';
        }
        
    };
    //recieve bid function
    socket.on('updateBid', function(updatedBid){
//        console.log(updatedBid);
        $scope.myBid=0;
        $scope.currentBid=updatedBid.bid;
        $scope.currentBidder=updatedBid.userName;
        $scope.minBid=$scope.currentBid+1;
        $scope.adminMsg='';     
        $scope.bidError='';
        $scope.$digest();
        //update the bid in the interface
        
    });
    
    
    /*****
    DRAFT FUNCTION
    *****/
    //send the draft info
    $scope.submitDraft=function(){        
        //all data should be in the bid
        socket.emit('draft', $scope.bids[0]._id);
    };
    
    //get draft result
    socket.on('updateDraft', function(input){
        //update the owner
        //continue auction
        for(var x=0;x<$scope.owners.length;x++){
            if($scope.owners[x]._id===input.ownerId){
//                console.log($scope.owners[x].paidPlayer.length);

                for(var y=0;y<$scope.owners[x].paidPlayer.length;y++){
//                    console.log($scope.owners[x].paidPlayer[y]);
                    if($scope.owners[x].paidPlayer[y].name===input.player.position){
//                        console.log('2');
                        //push player in
                        $scope.owners[x].paidPlayer[y].roster.push(input.player);
                        if(input.ownerId===$scope.myOwner._id){
//                            console.log('3');
                            $scope.myOwner=$scope.owners[x];
                        }
                        break;
                    }
                }
            }
        }            
        $scope.bids[0].nomStatus=false;
        $scope.adminMsg='';
        $scope.currentBid=0;
        $scope.currentBidder='';
        $scope.$digest();
        $scope.iterateIndex(); 
        
        var historyInput={};
        historyInput.playerName=input.player.name;
        historyInput.playerId=input.player._id;
        historyInput.ownerId=input.ownerId;
        historyInput.amount=input.player.price[1];
        $scope.addHistory(historyInput);
    });
    
    /**********
    END AUCTION
    **********/
    socket.on('endAuction',function(msg){
        $scope.bids[0].rookieDraft=false;
        $scope.bids[0].auctionDraft=false;
        $scope.bids[0].snakeDraft=true;
        $scope.$digest();
        console.log(msg); 
    });

    
    
    /*****
    ACTIVATE ROOKIE
    ****/
    //activate rookie draft
    $scope.rookieStart=function(){
//        console.log($scope.bids[0]._id);
        socket.emit('activateRookie', $scope.bids[0]._id);
    };
    
//    update page
    socket.on('startRookie',function(input){
        $scope.bids[0].rookieDraft=true;
        $scope.bids[0].auctionDraft=false;
        $scope.bids[0].snakeDraft=false;
        $scope.$digest();
    });

    /*****
    ACTIVATE AUCTION
    ****/
    //activate AUCTION draft
    $scope.activateAuction=function(){
        socket.emit('activateAuction', $scope.bids[0]._id);
    };
    
    //update page
    socket.on('startAuction',function(){
        $scope.bids[0].rookieDraft=false;
        $scope.bids[0].auctionDraft=true;
        $scope.bids[0].snakeDraft=false;
        $scope.$digest();
    });
    
    //add updated player
    socket.on('addPlayerList', function(input){
        $scope.players.push(input);
        $scope.$digest();
    });
    
    
    /*****
    ACTIVATE SNAKE
    ****/
    //activate SNAKE draft
    $scope.activateSnake=function(){
        socket.emit('end auction draft', $scope.bids[0]._id);
    };
//    
    
    $scope.changeUser=function(owner){
        $scope.displayOwner=owner;  
    };
    
    
    $scope.addHistory=function(input){
        var historyTest=true;        
        if($scope.history.length){
            historyTest=false;
        }
        else{
            for(var x=0; x<$scope.history.length;x++){
                if(input.playerName===$scope.history[x].player.name){
                    historyTest=false;
                }
            }            
        }
        console.log('historyTest: ' + historyTest + ' history length: ' + $scope.history.length);
        if(historyTest===true){
            var history = new Histories({
                name:input.playerName,
                owner:input.ownerId,
                player: input.playerId,
                amount: input.amount
            });

            history.$save(function(response) {
                $http.get('/histories').
                    success(function(data, status){
                        $scope.history=data;
                    });            
                $scope.$digest();

            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
                console.log($scope.error);
            });                      
        }
  
        
//        
//        socket.emit('addHistory', history);
    };
    
    
    /*******
    EXECUTIVE FUNCTIONS
    ******/
    /*******
    ROOKIE
    ******/
    $scope.execRookie=function(){
        $scope.input={};
        $scope.input.bidId=$scope.bids[0]._id;
        $scope.input.index=$scope.bids[0].rookieDraftIndex;
        $scope.input.playerId=$scope.eplayerId;
        $scope.input.ownerId=$scope.eownerId;
        $scope.input.ownerName=$scope.eownerName;          
//        console.log($scope.input);
        socket.emit('draftRookie', $scope.input);           
    };

    /*******
    NOMINATE
    ******/    
    $scope.execNom=function(){
        $scope.nomPlayer={};
        $scope.nomPlayer.bidId=$scope.bids[0]._id;
        $scope.nomPlayer.playerId=$scope.eplayerId;
        $scope.nomPlayer.ownerId=$scope.eownerId;
        $scope.nomPlayer.ownerName=$scope.eownerName;
//            console.log($scope.nomPlayer);
        socket.emit('nominate player', $scope.nomPlayer);          
    };
    /*******
    SEND BID
    ******/
    $scope.execBid=function(){
        $scope.outBid={};
        $scope.outBid.bidId=$scope.bids[0]._id;
        $scope.outBid.bid=$scope.eamount;
        $scope.outBid.userId=$scope.eownerId;
        $scope.outBid.userName=$scope.eownerName;
        socket.emit('send bid', $scope.outBid);                    
    };

    /*******
    SNAKE
    ******/
    $scope.execSnake=function(){
        $scope.input={};
        $scope.input.bidId=$scope.bids[0]._id;
        $scope.input.playerId=$scope.eplayerId;
        $scope.input.ownerId=$scope.eownerId;
        $scope.input.index=$scope.bids[0].rookieDraftIndex;
        $scope.input.ownerName=$scope.eownerName;
        socket.emit('draftSnake', $scope.input);                    
    };
    

    
    
//    //update page
//    socket.on('startSnake',function(){
//        $scope.bids[0].rookieDraft=false;
//        $scope.bids[0].auctionDraft=false;
//        $scope.bids[0].snakeDraft=true;
//        $scope.$digest();
//    });    
//    
    
    
	}
]);

//user
//{ "_id" : ObjectId("53b88fdf248d1c4d7f9226c7"), "displayName" : "Fred Griefer" }
//{ "_id" : ObjectId("53b88f36248d1c4d7f9226c3"), "displayName" : "Giovanni Pindilli" }
//{ "_id" : ObjectId("53b88f5f248d1c4d7f9226c4"), "displayName" : "Christina Kang" }
//{ "_id" : ObjectId("53b8903c248d1c4d7f9226ca"), "displayName" : "Ross Bramlet" }
//{ "_id" : ObjectId("53b8907a248d1c4d7f9226cc"), "displayName" : "Dave Milliner" }
//{ "_id" : ObjectId("53b8905d248d1c4d7f9226cb"), "displayName" : "Nish Narenchania" }
//{ "_id" : ObjectId("53b88f9d248d1c4d7f9226c5"), "displayName" : "Jessica Dorn" }
//{ "_id" : ObjectId("53b88fbd248d1c4d7f9226c6"), "displayName" : "Mark Hansberger" }
//{ "_id" : ObjectId("53aa16f715280e0f07029dd9"), "displayName" : "Michael Hong" }
//{ "_id" : ObjectId("53b88ff9248d1c4d7f9226c8"), "displayName" : "Greg Flowers" }
//{ "_id" : ObjectId("53b88ece248d1c4d7f9226c2"), "displayName" : "Mike Ramos" }
//{ "_id" : ObjectId("53b8901b248d1c4d7f9226c9"), "displayName" : "Kevin Quencer" }

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
