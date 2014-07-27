'use strict';

angular.module('players').controller('AllplayersController', ['$scope', '$stateParams', '$location', 'Authentication', 'Players',
	function($scope, $stateParams, $location, Authentication, Players ) {
		$scope.authentication = Authentication;
		/***
        *INIT FUNCTION
        ***/
        // Find a list of Players
		$scope.find = function() {
			$scope.players = Players.query();
            $scope.filters={};
            $scope.filters.position='';
            $scope.availableString='All Players';
            $scope.filters.available='';
            $scope.availableString='';        
            
		};
        
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
        
        //filter by availability
        
	}
]);