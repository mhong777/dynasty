'use strict';

angular.module('owners').controller('TradeController', ['$scope', '$stateParams', '$location', 'Authentication', 'Owners', '$http',
	function($scope, $stateParams, $location, Authentication, Owners, $http ) {
		$scope.authentication = Authentication;

        /******
        INITIALIZATION FOR MAIN PAGE
        ******/
		// Find a list of Owners
		$scope.find = function() {
			$scope.owners = Owners.query();
		};
        /************
        METRICS
        *************/
//        //get the total number of players
//        $scope.totalPlayers = function(owner){
//            var totPlayer=0;
//            for(var i=0; i<owner.paidPlayer.length;i++){
//                totPlayer+=owner.paidPlayer[i].roster.length;
//            }
//            return totPlayer
//        };
//        
//        //get the total salary of an owner
//        $scope.totalSalary = function(owner){
//            var totSalary=0;
//            for(var i=0; i<owner.paidPlayer.length;i++){
//                for(var y=0; y<owner.paidPlayer[i].roster.length;y++){
//                    totSalary+=owner.paidPlayer[i].roster[y].price[1];    
//                }                
//            }
//            return totSalary;
//        };
//        
//        //get number of players in a given position
//        $scope.numPosition = function(position, owner){
//            for(var i=0; i<owner.paidPlayer.length;i++){
//                if(owner.paidPlayer[i].name===position){                    
//                    return owner.paidPlayer[i].roster.length;
//                }   
//            }
//        };
//        
//        //get the cost of a given position
//        $scope.salaryPosition = function(position, owner){
//            var posSalary=0;
//            for(var i=0; i<owner.paidPlayer.length;i++){
//                if(owner.paidPlayer[i].name===position){     
//                    for(var y=0;y<owner.paidPlayer[i].roster.length;y++){
//                        posSalary+=owner.paidPlayer[i].roster[y].price[1];    
//                    }
//                    return posSalary;
//                }   
//            }            
//        };
//        
//        //define salary cap
//        $scope.salaryCap=300;
//        $scope.availableCap=function(){
//            if($scope.owner.totalCap>$scope.salaryCap){
//                return 'overCap';
//            }  
//            else{
//                return 'underCap';
//            }
//        };
//        
//        //get the end rank of the selected owner - for sorting
//        $scope.endRank=function(selectedOwner){
//          return selectedOwner.rank[0];  
//        };
//        
        /*******
        SELECT USER
        ********/
        $scope.owner1={};
        $scope.owner2={};
        $scope.selectUser=function(ownerId){
            
        };
        
	}
]);