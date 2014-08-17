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
            req.price=$scope.player.price;
            req.available=$scope.player.available;
            req.unavailable=$scope.player.unavailable;
            req.owner=$scope.player.owner;
            req.contractYear=$scope.player.contractYear;
            req.rookie=$scope.player.rookie;
            
            console.log(req);

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

        
//KevinQuencer	53b9dac03391bfbf8a2e3e36 6
//MichaelRamos	53b9dac03391bfbf8a2e3dfe 0
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
        
//MichaelRamos	0    53b9dac03391bfbf8a2e3dfe
//MichaelHong	1 53b9dac03391bfbf8a2e3e05
//GiovanniPindilli	2    53b9dac03391bfbf8a2e3e13
//ChristinaKang	3   53b9dac03391bfbf8a2e3e0c
//JessicaDorn	4 53b9dac03391bfbf8a2e3e1a
//MarkHansberger	5  53b9dac03391bfbf8a2e3e21
//FrederickGriefer	6    53b9dac03391bfbf8a2e3e28
//GregFlowers	7 53b9dac03391bfbf8a2e3e2f
//KevinQuencer	8    53b9dac03391bfbf8a2e3e36
//RossBramlet	9 53b9dac03391bfbf8a2e3e4b
//NishNarenchania	10    53b9dac03391bfbf8a2e3e3d
//DavidMilliner	11  53b9dac03391bfbf8a2e3e44 
        
        
        var ownerIds=['53b9dac03391bfbf8a2e3dfe','53b9dac03391bfbf8a2e3e05','53b9dac03391bfbf8a2e3e13','53b9dac03391bfbf8a2e3e0c','53b9dac03391bfbf8a2e3e1a',
                  '53b9dac03391bfbf8a2e3e21','53b9dac03391bfbf8a2e3e28','53b9dac03391bfbf8a2e3e2f','53b9dac03391bfbf8a2e3e36','53b9dac03391bfbf8a2e3e4b',
                  '53b9dac03391bfbf8a2e3e3d','53b9dac03391bfbf8a2e3e44'];
        
		// Update player owner
		$scope.updateOwner = function() {
            console.log('start');
//            console.log($scope.players[0].name);
            var req={};

            for(var i=0;i<$scope.players.length;i++){
                req={};
                req.playerId=$scope.players[i]._id;
                for(var y=0;y<ownerIds.length;y++){
                    if($scope.players[i].ownerId===y){
                        req.owner=ownerIds[y];
                        //updatePlayerOwner
                        $http.put('/updatePlayerOwner',req).
                            success(function(data, status){
                                console.log(data);
                            });                        
//                        console.log($scope.players[i].name + ' ' + y + ' ' + req.owner);
                        break;
                    }                    
                }
            }            
            return;
		};        
        
        $scope.editPlayer = function(playerId){
             window.location.href='#!/players/' + playerId + '/edit';
            return;

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
                    console.log(player.name + ',' + response._id);
                    //$location.path('players/' + response._id);
                }, function(errorResponse) {
                    $scope.error = errorResponse.data.message;
                    console.log($scope.error);
                });
            });            
        };            
        
	}
]);