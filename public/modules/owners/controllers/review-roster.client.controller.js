'use strict';

angular.module('owners').controller('ReviewRosterController', ['$scope', '$stateParams', '$location', 'Authentication', 'Owners', '$http',
	function($scope, $stateParams, $location, Authentication, Owners, $http ) {
		$scope.authentication = Authentication;
		// Review roster controller logic
        /********
        INITIALIZATION FUNCTIONS
        ********/
		// Find existing Owner
		$scope.findOne = function() {
//			$scope.owner = Owners.get({ 
//				ownerId: $stateParams.ownerId
//			});
            $http.get('/owners/' + $stateParams.ownerId).
                success(function(data, status){
                    $scope.owner=data;
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
//                console.log('attempt');
//                console.log(owner)
                for(var i=0; i<owner.paidPlayer.length;i++){
                    totPlayer+=owner.paidPlayer[i].roster.length;
                }
                console.log(totPlayer);
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
                totSalary+=owner.additionalCap;
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
            //FUNCTION FOR CHECKING USER
            $scope.checkUser=function(){
                if($scope.authentication.user._id===$scope.owner.userIndex){
                    return true;
                }
                else{return false;}
            };            
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
        MAIN FUNCTIONALITY
        ********/
        // Get link and go to link
        //if no link is there do something else
        $scope.goToEspn=function(playerLink){
            if(playerLink===''){
                window.open('http://games.espn.go.com/frontpage/football', '_newtab');
                return;
            }
            else{
                window.open(playerLink,'_newtab');  
                return;
            }
        };          
        
        //FUNCTION FOR CHECKBOX TO CUT PLAYER
        $scope.cutPlayer=function(playerId, positionId){
            //find index and remove player
            var salary=0;
            
            for(var i=0;i<$scope.owner.paidPlayer.length;i++){                
                if($scope.owner.paidPlayer[i].name===positionId){
                    for(var j=0;j<$scope.owner.paidPlayer[i].roster.length;j++){
                        if($scope.owner.paidPlayer[i].roster[j]._id===playerId){
                            //put player on cut list
                            $scope.owner.paidPlayer[i].roster[j].unavailable=false;
//                            salary = $scope.owner.paidPlayer[i].roster[j].price[1];                            
                            $scope.owner.cutPlayer.push($scope.owner.paidPlayer[i].roster[j]);                                                        
                            //remove player from paid player list
                            //alter local variables
                            $scope.owner.paidPlayer[i].roster.splice(j,1);
//                            $scope.owner.totalPlayers--;                            
//                            $scope.owner.totalCap-=salary;
//                            $scope.owner.paidPlayer[i].cost-=salary;
                                                        
                            //need to add/remove from database
                            var reqBody={};
                            reqBody.totalCap=$scope.owner.totalCap;
                            reqBody.totalPlayers=$scope.owner.totalPlayers;
                            reqBody.positionId=positionId;
                            reqBody.playerId=playerId;
                            reqBody.cutStatus=0;

                            //make cutPlayer
                            reqBody.cutPlayer=[];
                            for(var k=0;k<$scope.owner.cutPlayer.length;k++){
                                reqBody.cutPlayer.push($scope.owner.cutPlayer[k]._id);
                            }
                            //make paidPlayer
                            reqBody.paidPlayer={};                            
                            reqBody.paidPlayer.roster=[];
                            reqBody.paidPlayer.name=positionId;
                            reqBody.paidPlayer.cost=$scope.owner.paidPlayer[i].cost;
                            for(var l=0;l<$scope.owner.paidPlayer[i].roster.length;l++){
                                reqBody.paidPlayer.roster.push($scope.owner.paidPlayer[i].roster[l]._id);
                            }
                            
                            console.log(reqBody);
                            $http.put('/alterRoster/' + $scope.owner._id,reqBody).
                                success(function(data, status){
                                    console.log(data);
                                });
                            return;
                        }
                    }
                }
            }                        
        };

//        //FUNCTION FOR CHECKBOX TO PAY PLAYER
        $scope.payPlayer=function(playerId, positionId){
            //find position index
            var salary=0,
                rosterSpot;
            
            for(var j=0;j<$scope.owner.cutPlayer.length;j++){
                if($scope.owner.cutPlayer[j]._id===playerId){
                    rosterSpot=j;
                    break;
                }
            }
            
            //add him to the paidPlayer list
            for(var i=0;i<$scope.owner.paidPlayer.length;i++){                
                if($scope.owner.paidPlayer[i].name===positionId){
                    //put player on paid list
                    $scope.owner.cutPlayer[rosterSpot].available=false;
                    salary = $scope.owner.cutPlayer[rosterSpot].price[1];
                    $scope.owner.paidPlayer[i].roster.push($scope.owner.cutPlayer[rosterSpot]);
                    //remove player from cut list
                    $scope.owner.cutPlayer.splice(rosterSpot,1);
                    $scope.owner.totalPlayers++;
                    $scope.owner.totalCap+=salary;
                    $scope.owner.paidPlayer[i].cost+=salary;                    
                    
                    //need to add/remove from database
                    var reqBody={};
                    reqBody.totalCap=$scope.owner.totalCap;
                    reqBody.totalPlayers=$scope.owner.totalPlayers;
                    reqBody.positionId=positionId;
                    reqBody.playerId=playerId;
                    reqBody.cutStatus=1;

                    //make cutPlayer
                    reqBody.cutPlayer=[];
                    for(var k=0;k<$scope.owner.cutPlayer.length;k++){
                        reqBody.cutPlayer.push($scope.owner.cutPlayer[k]._id);
                    }
                    //make paidPlayer
                    reqBody.paidPlayer={};                            
                    reqBody.paidPlayer.roster=[];
                    reqBody.paidPlayer.name=positionId;
                    reqBody.paidPlayer.cost=$scope.owner.paidPlayer[i].cost;
                    for(var l=0;l<$scope.owner.paidPlayer[i].roster.length;l++){
                        reqBody.paidPlayer.roster.push($scope.owner.paidPlayer[i].roster[l]._id);
                    }
                    console.log(reqBody);
                    $http.put('/alterRoster/' + $scope.owner._id,reqBody);                    
                    return;

                }
            }               
        };        
        
        /*********
        ADMIN FUNCTIONS - DON'T USE
        *********/
        //UPDATE SALARY 
        $scope.updateSalaryTest=function(ownerId){
            $scope.totalCap=0;
            $http.put('/ownerUpdate/' + ownerId, $scope.totalCap);
        };              
	}                                                    
]);