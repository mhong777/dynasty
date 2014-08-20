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
        
        /******
        GET ALL DATA
        ******/
		// Find a list of Owners
        $http.get('/owners').
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
                            return 350-totSalary;
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
                $scope.currentBidder=$scope.bids[0].ownerName;
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
    
    
	}
]);


//
//053b9dac03391bfbf8a2e3e4b chat.client.controller.js:24
//153b9dac03391bfbf8a2e3e44 chat.client.controller.js:24
//253b9dac03391bfbf8a2e3e3d chat.client.controller.js:24
//353b9dac03391bfbf8a2e3e36 chat.client.controller.js:24
//453b9dac03391bfbf8a2e3e2f chat.client.controller.js:24
//553b9dac03391bfbf8a2e3e28 chat.client.controller.js:24
//653b9dac03391bfbf8a2e3e21 chat.client.controller.js:24
//753b9dac03391bfbf8a2e3e1a chat.client.controller.js:24
//853b9dac03391bfbf8a2e3e13 chat.client.controller.js:24
//953b9dac03391bfbf8a2e3e0c chat.client.controller.js:24
//1053b9dac03391bfbf8a2e3e05 chat.client.controller.js:24
//1153b9dac03391bfbf8a2e3dfe 
//
//
//KevinQuencer	53b9dac03391bfbf8a2e3e36
//MichaelRamos	53b9dac03391bfbf8a2e3dfe
//GregFlowers	53b9dac03391bfbf8a2e3e2f
//MichaelHong	53b9dac03391bfbf8a2e3e05
//MarkHansberger	53b9dac03391bfbf8a2e3e21
//JessicaDorn	53b9dac03391bfbf8a2e3e1a
//NishNarenchania	53b9dac03391bfbf8a2e3e3d
//DavidMilliner	53b9dac03391bfbf8a2e3e44
//RossBramlet	53b9dac03391bfbf8a2e3e4b
//ChristinaKang	53b9dac03391bfbf8a2e3e0c
//GiovanniPindilli	53b9dac03391bfbf8a2e3e13
//FrederickGriefer	53b9dac03391bfbf8a2e3e28