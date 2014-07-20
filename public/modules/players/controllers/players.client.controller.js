'use strict';


var testPlayer=[
{name:'Eric Berry',link:'',team:'',position:'DF',byeWeek:[0,0],startRank:{absRank:[0,237], posRank:[0,151]},endRank:{absRank:[464], posRank:[151]},ownerId:'9',contractYear:'1',pIndex:'461',price:[1,1.01],available:'true',listed:'false',unavailable:'false',points:[0]},
];
//
//var qb = [
//{ _id : "53b9a18f3391bfbf8a2e3dd8", price : [ 1, 1.01 ], name : "Ryan Fitzpatrick" },
//{ _id : "53b9a18d3391bfbf8a2e3c7b", price : [ 47.25, 47.7 ], name : "Matt Ryan" },
//{ _id : "53b9a18e3391bfbf8a2e3c9b", price : [ 18.18, 19.089 ], name : "Andy Dalton" }
//];
//
//var rb=[
//{ _id : "53b9a18e3391bfbf8a2e3cd6", price : [ 1, 1 ], name : "Mike Tolbert" },
//{ _id : "53b9a18e3391bfbf8a2e3ced", price : [ 1, 1.01 ], name : "Bobby Rainey" },
//{ _id : "53b9a18d3391bfbf8a2e3c26", price : [ 25.25, 26.5 ], name : "DeMarco Murray" },
//{ _id : "53b9a18d3391bfbf8a2e3c65", price : [ 1, 1.1 ], name : "Knowshon Moreno" },
//{ _id : "53b9a18e3391bfbf8a2e3c98", price : [ 1, 1 ], name : "Roy Helu" }
//];
//
//var wr=[
//{ _id : "53b9a18e3391bfbf8a2e3ccf", price : [ 1, 1 ], name : "Kenny Stills" },
//{ _id : "53b9a18d3391bfbf8a2e3c2b", price : [ 49.5, 52 ], name : "Brandon Marshall" },
//{ _id : "53b9a18d3391bfbf8a2e3c2e", price : [ 22.22, 22.4 ], name : "Jordy Nelson" },
//{ _id : "53b9a18d3391bfbf8a2e3c69", price : [ 1.05, 1.1 ], name : "Eric Decker" },
//{ _id : "53b9a18d3391bfbf8a2e3c6a", price : [ 1.01, 1 ], name : "Cecil Shorts" }
//];
//
//var te =[
//{ _id : "53b9a18e3391bfbf8a2e3ce1", price : [ 5, 5.05 ], name : "Coby Fleener" },
//{ _id : "53b9a18d3391bfbf8a2e3c3b", price : [ 32, 32.3 ], name : "Rob Gronkowski" }
//];
//
//var df=[
//{ _id : "53b9a18f3391bfbf8a2e3dd9", price : [ 1, 1.01 ], name : "Earl Thomas" },
//{ _id : "53b9a18f3391bfbf8a2e3dda", price : [ 1, 1.01 ], name : "Alterraun Verner" },
//{ _id : "53b9a18f3391bfbf8a2e3ddb", price : [ 1, 1.01 ], name : "Eric Weedle" }
//];

// Players controller
angular.module('players').controller('PlayersController', ['$scope', '$stateParams', '$location', 'Authentication', 'Players',
	function($scope, $stateParams, $location, Authentication, Players ) {
		$scope.authentication = Authentication;
        
        //positions
//        $scope.init2=function(){
//            $scope.qb= qb;
//            $scope.rb=rb;
//            $scope.wr=wr;
//            $scope.te=te;
//            $scope.df=df;
//            
//            $scope.posSum=[0,0,0,0,0];
//            
//            angular.forEach($scope.qb, function(player){
//                $scope.posSum[0]+=player.price[1];
//            });
//            angular.forEach($scope.rb, function(player){
//                $scope.posSum[1]+=player.price[1];
//            });
//            angular.forEach($scope.wr, function(player){
//                $scope.posSum[2]+=player.price[1];
//            });
//            angular.forEach($scope.te, function(player){
//                $scope.posSum[3]+=player.price[1];
//            });
//            angular.forEach($scope.df, function(player){
//                $scope.posSum[4]+=player.price[1];
//            });                        
//        };                
//        
//        $scope.init2();
        
		// Create new Player
		$scope.create = function() {
			// Create new Player object
			var player = new Players ({
				name: this.name
			});

			// Redirect after save
			player.$save(function(response) {
				$location.path('players/' + response._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});

			// Clear form fields
			this.name = '';
		};

		// Remove existing Player
		$scope.remove = function( player ) {
			if ( player ) { player.$remove();

				for (var i in $scope.players ) {
					if ($scope.players [i] === player ) {
						$scope.players.splice(i, 1);
					}
				}
			} else {
				$scope.player.$remove(function() {
					$location.path('players');
				});
			}
		};

		// Update existing Player
		$scope.update = function() {
			var player = $scope.player ;

			player.$update(function() {
				$location.path('players/' + player._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

        $scope.playerJson=testPlayer;  
        //Create players from JSON
        $scope.createFromJson = function(){
            
            angular.forEach($scope.playerJson, function(playerProfile){
                var player = new Players({
                    name: playerProfile.name,
                    link: playerProfile.link,
                    team: playerProfile.team,
                    position: playerProfile.position,
                    byeWeek: playerProfile.byeWeek,
                    startRank: playerProfile.startRank,
                    endRank: playerProfile.endRank,
                    contractYear: playerProfile.contractYear,
                    price: playerProfile.price,
                    available: playerProfile.available,
                    listed: playerProfile.listed,
                    unavailable: playerProfile.unavailable,
                    points: playerProfile.points,
                    ownerId: playerProfile.ownerId
                });
                
//                console.log(player.name);
                
                player.$save(function(response) {
                    console.log(player.name + ',' + response._id)
                    //$location.path('players/' + response._id);
                }, function(errorResponse) {
                    $scope.error = errorResponse.data.message;
                    console.log($scope.error);
                });
            });            
        };        

		// Find a list of Players
		$scope.find = function() {
			$scope.players = Players.query();
		};

		// Find existing Player
		$scope.findOne = function() {
			$scope.player = Players.get({ 
				playerId: $stateParams.playerId
			});
		};
	}
]);