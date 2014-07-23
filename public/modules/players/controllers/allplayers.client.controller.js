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
        }
        
        /*******
        *FOR FILTERS
        *******/
        $scope.filters={};
        $scope.filters.position=[];
        //filter by position
        $scope.addFilter=function(position){
            $scope.filters.position.push(position);  
        };
        
        //filter by availability
        
	}
]);