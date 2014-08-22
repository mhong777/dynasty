'use strict';

angular.module('owners').controller('ChatController', ['$scope', '$stateParams', '$location', 'Authentication', 'Owners', '$http', 'socket', 'Bids',
function($scope, $stateParams, $location, Authentication, Owners, $http, socket, Bids ) {
    $scope.init=function(){
        /*******
        INITIALIZE VALUES
        ******/
        
        $scope.msgs=[];
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
                        
                        //get initial salary                        
                        $scope.myCap = function(owner){
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
                        
                        break;
                    }
                }                
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
		// Find a list of Bid Status
        $http.get('/bids').
            success(function(data, status){
                $scope.bids=data;              
                $scope.currentBid=$scope.bids[0].amount;
                $scope.currentBidder=$scope.bids[0].owner.name;
                $scope.indexNum=$scope.bids[0].indexNum;
                if($scope.bids[0].nomOwner===$scope.authentication.user.ownerId){
                    $scope.nomBool=true;
                }
                else{
                    $scope.nomBool=true;
                }
                if($scope.bids[0]){
                    $scope.nomPlayer=$scope.bids[0].player.name;
                }
                else{
                    $scope.nomPlayer='Nominated Player';
                }
            });             
        
        
        
        
        
        
        
    };//end initi function
    $scope.init();

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

    //ADMIN FUNCTION
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
        $scope.msgs.push(addMsg);
        console.log($scope.msgs);
        $scope.$digest();
    });
    
    /*****
    BID FUNCTION
    ****/
    //send bid function
    $scope.submitBid=function(){
        //add validation of bid
        
        
        $scope.outBid.bidId=$scope.bids[0]._id;
        $scope.outBid.bid=$scope.myBid;
        $scope.outBid.userId=$scope.userId;
        $scope.outBid.userName=$scope.userName;
        socket.emit('send bid', $scope.outBid);
        $scope.myBid=0;
        
    };
    //recieve bid function
    socket.on('updateBid', function(updatedBid){
        console.log(updatedBid);
        $scope.currentBid=updatedBid.bid;
        $scope.currentBidder=updatedBid.userName;
        $scope.$digest();
        //update the bid in the interface
        
    });
    
    
    /********
    CYCLE FUNCTION
    ********/
    $scope.iterateIndex=function(){
        $scope.cycleReq={};
        $scope.cycleReq.bidId=$scope.bids[0]._id;
        $scope.cycleReq.indexNum=$scope.indexNum;
        console.log($scope.cycleReq);
        socket.emit('iterate index',$scope.cycleReq);          
    };
    
    //get cycle index
    socket.on('getIndex', function(nextUser){
        $scope.indexNum=nextUser.indexNum;
        $scope.$digest();
        console.log(nextUser);
    });
    
    socket.on('testOut', function(msg){
//        console.log(msg); 
    });
    
    
    /*******
    NOMINATE
    *******/
    $scope.nominate=function(playerId, available){
        if(available){
            $scope.nomPlayer={};
            $scope.nomPlayer.bidId=$scope.bids[0]._id;
            $scope.nomPlayer.playerId=playerId;
            
//            console.log(playerId);
            socket.emit('nominate player', $scope.nomPlayer);            
            $scope.nomError='';
        }  
        else{
            $scope.nomError='player is not available';
        }
    };
    //get nominated player
    socket.on('updateNominate', function(player){
        $scope.nomPlayer=player.name;
        //update the player in the list
        //loop through players to find it
        $scope.$digest();
        console.log(player); 
    });
    
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
