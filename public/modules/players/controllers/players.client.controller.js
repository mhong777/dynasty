'use strict';


var testPlayer=[
{name:'Eric Berry',link:'',team:'',position:'DF',byeWeek:[0,0],startRank:{absRank:[0,237], posRank:[0,151]},endRank:{absRank:[464], posRank:[151]},ownerId:'9',contractYear:'1',pIndex:'461',price:[1,1.01],available:'true',listed:'false',unavailable:'false',points:[0]},
];

// Players controller
angular.module('players').controller('PlayersController', ['$scope', '$stateParams', '$location', 'Authentication', 'Players', '$http',
	function($scope, $stateParams, $location, Authentication, Players, $http ) {
		$scope.authentication = Authentication;
        
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
            var req={};
            req.playerId=$scope.player._id;
            req.team=$scope.player.team;
            req.byeWeek=$scope.player.byeWeek;
            req.price=$scope.player.price[1];
            req.available=$scope.player.available;
            req.unavailable=$scope.player.unavailable;
            req.owner=$scope.player.owner;
            req.contractYear=$scope.player.contractYear;

            $http.put('/playerUpdate',req).
                success(function(data, status){
                    console.log(data);
                });
            window.location.href='#!/players';
            return;
            
            
//			var player = $scope.player ;
//
//			player.$update(function() {
//				$location.path('players/' + player._id);
//			}, function(errorResponse) {
//				$scope.error = errorResponse.data.message;
//			});
		};

        $scope.editPlayer = function(playerId){
             window.location.href='#!/players/' + playerId + '/edit';
            return;

        }

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
        
        /*********
        *ADMIN FUNCTION - NOT USED
        *********/
        
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

                
                player.$save(function(response) {
                    console.log(player.name + ',' + response._id)
                    //$location.path('players/' + response._id);
                }, function(errorResponse) {
                    $scope.error = errorResponse.data.message;
                    console.log($scope.error);
                });
            });            
        };            
        
	}
]);