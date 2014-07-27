'use strict';

angular.module('owners').controller('TradeController', ['$scope', '$stateParams', '$location', 'Authentication', 'Owners', '$http', 'socket',
	function($scope, $stateParams, $location, Authentication, Owners, $http, socket ) {
		$scope.authentication = Authentication;

        /******
        INITIALIZATION FOR MAIN PAGE
        ******/
		// Find a list of Owners
		$scope.find = function() {
            $http.get('/owners').
                success(function(data, status){
                    $scope.owners=data;
                    $scope.init();         
                });      
		};
        /************
        METRICS
        *************/
        $scope.init=function(){
            //get the total number of players
            $scope.totalPlayers = function(owner){
                var totPlayer=0;
                for(var i=0; i<owner.paidPlayer.length;i++){
                    totPlayer+=owner.paidPlayer[i].roster.length;
                }
                return totPlayer;
            };

            //get the total salary of an owner
            $scope.totalSalary = function(owner){
                var totSalary=0;
                for(var i=0; i<owner.paidPlayer.length;i++){
                    for(var y=0; y<owner.paidPlayer[i].roster.length;y++){
                        totSalary+=owner.paidPlayer[i].roster[y].price[1];    
                    }                
                }
                return totSalary;
            };

            //get number of players in a given position
            $scope.numPosition = function(position, owner){
                for(var i=0; i<owner.paidPlayer.length;i++){
                    if(owner.paidPlayer[i].name===position){                    
                        return owner.paidPlayer[i].roster.length;
                    }   
                }
            };

            //get the cost of a given position
            $scope.salaryPosition = function(position, owner){
                var posSalary=0;
                for(var i=0; i<owner.paidPlayer.length;i++){
                    if(owner.paidPlayer[i].name===position){     
                        for(var y=0;y<owner.paidPlayer[i].roster.length;y++){
                            posSalary+=owner.paidPlayer[i].roster[y].price[1];    
                        }
                        return posSalary;
                    }   
                }            
            };

            //define salary cap
            $scope.salaryCap=300;
            $scope.availableCap=function(){
                if($scope.owner.totalCap>$scope.salaryCap){
                    return 'overCap';
                }  
                else{
                    return 'underCap';
                }
            };

            //get the end rank of the selected owner - for sorting
            $scope.endRank=function(selectedOwner){
              return selectedOwner.rank[0];  
            };            
            
            //initialize trade players
            $scope.tradePlayer1=[];
            $scope.tradePlayer2=[];
            $scope.tradeDraft1=[];
            $scope.tradeDraft2=[];
            $scope.owner1={};
            $scope.owner2={};            
            $scope.owner1Cap=0;
            $scope.owner2Cap=0;            
        };

        /*******
        FOR SORTING
        ******/
        $scope.positionList=function(position){
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
        
        /*******
        ADD PLAYER TO THE TRADE TABLE
        ********/
        
         $scope.addTradePlayer1 = function(player){
             if(player.tradeStatus){
                 for(var x=0;x<$scope.tradePlayer1.length;x++){
                     if($scope.tradePlayer1[x]._id===player._id){
                         $scope.tradePlayer1.splice(x,1);
                     }
                 }
             }
             else{
                 $scope.tradePlayer1.push(player);                                  
             }
         };
        
         $scope.addTradePlayer2 = function(player){
             if(player.tradeStatus){
                 for(var x=0;x<$scope.tradePlayer1.length;x++){
                     if($scope.tradePlayer1[x]._id===player._id){
                         $scope.tradePlayer1.splice(x,1);
                     }
                 }
             }
             else{
                 $scope.tradePlayer2.push(player);                                  
             }
         };
        
        /*******
        SELECT USER
        ********/
        $scope.selectUser1=function(owner){
            if(owner!=$scope.owner2){
                $scope.tradeDraft1=[];
                $scope.tradePlayer1=[];
                for(var x=0;x<owner.paidPlayer.length;x++){
                    for(var y=0;y<owner.paidPlayer[x].roster.length;y++){
                        owner.paidPlayer[x].roster[y].tradeStatus=false;
                    }
                }
                $scope.owner1Cap=0;
                $scope.owner1=owner;                
                $scope.owner1.tradePicks=[];
                for(var y=0;y<owner.draftPicks.length;y++){
                    $scope.owner1.tradePicks.push({pick:owner.draftPicks[y],status:false});
                }
            }
        };
        $scope.selectUser2=function(owner){            
            if(owner!=$scope.owner1){
                $scope.tradeDraft2=[];
                $scope.tradePlayer2=[];
                for(var x=0;x<owner.paidPlayer.length;x++){
                    for(var y=0;y<owner.paidPlayer[x].roster.length;y++){
                        owner.paidPlayer[x].roster[y].tradeStatus=false;
                    }
                }
                $scope.owner2Cap=0;
                $scope.owner2=owner;
                $scope.owner2.tradePicks=[];
                for(var y=0;y<owner.draftPicks.length;y++){                    
                    $scope.owner2.tradePicks.push({pick:owner.draftPicks[y],status:false});
                }
            }
        };        
        
        /********
        ADD/REMOVE DRAFT PICKS
        ********/
        $scope.addDraftPick1=function(draft){
             if(draft.status){
                 for(var x=0;x<$scope.tradeDraft1.length;x++){
                     if($scope.tradeDraft1[x].pick===draft.pick){
                         $scope.tradeDraft1.splice(x,1);
                     }
                 }
             }
             else{
                 $scope.tradeDraft1.push(draft);                                  
             }            
        };

        $scope.addDraftPick2=function(draft){
             if(draft.status){
                 for(var x=0;x<$scope.tradeDraft2.length;x++){
                     if($scope.tradeDraft2[x].pick===draft.pick){
                         $scope.tradeDraft2.splice(x,1);
                     }
                 }
             }
             else{
                 $scope.tradeDraft2.push(draft);                                  
             }            
        };
        
        /*******
        TRADE FUNCTION
        ********/
        $scope.tradePlayers=function(){
            var req={};
            req.tradePlayer1=$scope.tradePlayer1;
            req.tradePlayer2=$scope.tradePlayer2;
            req.tradeDraft1=$scope.tradeDraft1;
            req.tradeDraft2=$scope.tradeDraft2;
            req.owner1Cap=$scope.owner1Cap;
            req.owner2Cap=$scope.owner2Cap;
            console.log(req);
            

//            $scope.tradePlayer1=[];
//            $scope.tradePlayer2=[];
//            $scope.tradeDraft1=[];
//            $scope.tradeDraft2=[];
//            $scope.owner1={};
//            $scope.owner2={};            
//            $scope.owner1Cap=0;
//            $scope.owner2Cap=0;            
            
            
//            $http.put('/alterRoster/' + $scope.owner._id,reqBody).
//                success(function(data, status){
//                    console.log(data);
//                });            
        };
        
        
        /*****
        SOCKET TEST
        ****/
        $scope.sendMsg=function(){
            socket.emit('send msg', 'works');
        };
	}
]);