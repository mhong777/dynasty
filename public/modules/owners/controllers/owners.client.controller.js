'use strict';

//var testOwner=[
//{name:'MichaelRamos',user:'53b88ece248d1c4d7f9226c2',rank:[2],totalCap:327.5913,totalPlayers:18,cutPlayer:[],paidPlayer:[{name:'DF',roster:['53b9a18f3391bfbf8a2e3dcd'], cost:1.01},{name:'K',roster:['53b9a18e3391bfbf8a2e3ca5'], cost:1.1},{name:'QB',roster:['53b99f497c83554532580170','53b9a18e3391bfbf8a2e3cc4','53b9a18e3391bfbf8a2e3ce4','53b9a18e3391bfbf8a2e3d2f'], cost:103.5713},{name:'RB',roster:['53b9a18d3391bfbf8a2e3c31','53b9a18d3391bfbf8a2e3c40','53b9a18d3391bfbf8a2e3c4c','53b9a18d3391bfbf8a2e3c54','53b9a18d3391bfbf8a2e3c5a'], cost:115.7},{name:'TE',roster:['53b9a18e3391bfbf8a2e3cd7'], cost:6.3},{name:'WR',roster:['53b9a18d3391bfbf8a2e3c2a','53b9a18d3391bfbf8a2e3c47','53b9a18d3391bfbf8a2e3c4d','53b9a18d3391bfbf8a2e3c53','53b9a18e3391bfbf8a2e3cca','53b9a18e3391bfbf8a2e3cec'], cost:99.91}],ownerIndex:0,userIndex:'53b88ece248d1c4d7f9226c2'},
//{name:'MichaelHong',user:'53aa16f715280e0f07029dd9',rank:[4],totalCap:149.37,totalPlayers:18,cutPlayer:[],paidPlayer:[{name:'DF',roster:['53b9a18f3391bfbf8a2e3dd0','53b9a18f3391bfbf8a2e3dd2'], cost:2.02},{name:'K',roster:['53b9a18f3391bfbf8a2e3dd1'], cost:1.01},{name:'QB',roster:['53b9a18d3391bfbf8a2e3c8a','53b9a18e3391bfbf8a2e3cb5','53b9a18e3391bfbf8a2e3d12','53b9a18f3391bfbf8a2e3dce','53b9a18f3391bfbf8a2e3dcf'], cost:70.93},{name:'RB',roster:['53b9a18d3391bfbf8a2e3c6e','53b9a18d3391bfbf8a2e3c89','53b9a18d3391bfbf8a2e3c93'], cost:3.01},{name:'TE',roster:['53b9a18d3391bfbf8a2e3c78','53b9a18e3391bfbf8a2e3cce'], cost:2.2},{name:'WR',roster:['53b9a18d3391bfbf8a2e3c28','53b9a18d3391bfbf8a2e3c49','53b9a18d3391bfbf8a2e3c7c','53b9a18e3391bfbf8a2e3cd4','53b9a18e3391bfbf8a2e3ce9'], cost:70.2}],ownerIndex:1,userIndex:'53aa16f715280e0f07029dd9'},
//{name:'GiovanniPindilli',user:'53b88f36248d1c4d7f9226c3',rank:[11],totalCap:357.7602,totalPlayers:17,cutPlayer:[],paidPlayer:[{name:'K',roster:['53b9a18e3391bfbf8a2e3ca6'], cost:3.6},{name:'QB',roster:['53b9a18d3391bfbf8a2e3c29','53b9a18d3391bfbf8a2e3c46'], cost:174.6},{name:'RB',roster:['53b9a18d3391bfbf8a2e3c1d','53b9a18d3391bfbf8a2e3c4e','53b9a18d3391bfbf8a2e3c6d','53b9a18d3391bfbf8a2e3c87','53b9a18e3391bfbf8a2e3c99','53b9a18e3391bfbf8a2e3cde'], cost:138.7402},{name:'TE',roster:['53b9a18d3391bfbf8a2e3c4a','53b9a18d3391bfbf8a2e3c64'], cost:26.6},{name:'WR',roster:['53b9a18d3391bfbf8a2e3c77','53b9a18d3391bfbf8a2e3c79','53b9a18e3391bfbf8a2e3cc1','53b9a18e3391bfbf8a2e3cd8','53b9a18e3391bfbf8a2e3cfc','53b9a18e3391bfbf8a2e3d07'], cost:14.22},{name:'DF',roster:[], cost:0}],ownerIndex:2,userIndex:'53b88f36248d1c4d7f9226c3'},
//{name:'ChristinaKang',user:'53b88f5f248d1c4d7f9226c4',rank:[10],totalCap:324.05,totalPlayers:18,cutPlayer:[],paidPlayer:[{name:'DF',roster:['53b9a18f3391bfbf8a2e3dd3'], cost:1.01},{name:'K',roster:['53b9a18e3391bfbf8a2e3cac'], cost:1.1},{name:'QB',roster:['53b9a18d3391bfbf8a2e3c7a','53b9a18d3391bfbf8a2e3c86','53b9a18e3391bfbf8a2e3d36'], cost:88.71},{name:'RB',roster:['53b9a18d3391bfbf8a2e3c19','53b9a18d3391bfbf8a2e3c3d','53b9a18d3391bfbf8a2e3c45','53b9a18d3391bfbf8a2e3c81','53b9a18e3391bfbf8a2e3ce5'], cost:112.81},{name:'TE',roster:['53b9a18e3391bfbf8a2e3cf9','53b9a18e3391bfbf8a2e3d33'], cost:2.02},{name:'WR',roster:['53b9a18d3391bfbf8a2e3c30','53b9a18d3391bfbf8a2e3c44','53b9a18d3391bfbf8a2e3c66','53b9a18d3391bfbf8a2e3c70','53b9a18d3391bfbf8a2e3c88','53b9a18e3391bfbf8a2e3ca3'], cost:118.4}],ownerIndex:3,userIndex:'53b88f5f248d1c4d7f9226c4'},
//{name:'JessicaDorn',user:'53b88f9d248d1c4d7f9226c5',rank:[6],totalCap:269.555,totalPlayers:17,cutPlayer:[],paidPlayer:[{name:'K',roster:['53b9a18e3391bfbf8a2e3ca7'], cost:1.1},{name:'QB',roster:['53b9a18d3391bfbf8a2e3c24','53b9a18d3391bfbf8a2e3c58','53b9a18d3391bfbf8a2e3c91','53b9bd203391bfbf8a2e3df5'], cost:133.925},{name:'RB',roster:['53b9a18d3391bfbf8a2e3c35','53b9a18d3391bfbf8a2e3c52','53b9a18d3391bfbf8a2e3c71'], cost:120},{name:'TE',roster:['53b9a18d3391bfbf8a2e3c7e','53b9bd203391bfbf8a2e3df3'], cost:2.11},{name:'WR',roster:['53b9a18d3391bfbf8a2e3c5d','53b9a18d3391bfbf8a2e3c62','53b9a18d3391bfbf8a2e3c63','53b9a18e3391bfbf8a2e3cbe','53b9bd203391bfbf8a2e3df4','53b9bd203391bfbf8a2e3df6'], cost:12.42},{name:'DF',roster:[], cost:0}],ownerIndex:4,userIndex:'53b88f9d248d1c4d7f9226c5'},
//{name:'MarkHansberger',user:'53b88fbd248d1c4d7f9226c6',rank:[5],totalCap:218.389,totalPlayers:19,cutPlayer:[],paidPlayer:[{name:'DF',roster:['53b9a18f3391bfbf8a2e3dd9','53b9a18f3391bfbf8a2e3dda','53b9a18f3391bfbf8a2e3ddb'], cost:3.03},{name:'K',roster:['53b9a18e3391bfbf8a2e3ccc'], cost:2.1},{name:'QB',roster:['53b9a18d3391bfbf8a2e3c7b','53b9a18e3391bfbf8a2e3c9b','53b9a18f3391bfbf8a2e3dd8'], cost:67.799},{name:'RB',roster:['53b9a18d3391bfbf8a2e3c26','53b9a18d3391bfbf8a2e3c65','53b9a18e3391bfbf8a2e3c98','53b9a18e3391bfbf8a2e3cd6','53b9a18e3391bfbf8a2e3ced'], cost:30.61},{name:'TE',roster:['53b9a18d3391bfbf8a2e3c3b','53b9a18e3391bfbf8a2e3ce1'], cost:37.35},{name:'WR',roster:['53b9a18d3391bfbf8a2e3c2b','53b9a18d3391bfbf8a2e3c2e','53b9a18d3391bfbf8a2e3c69','53b9a18d3391bfbf8a2e3c6a','53b9a18e3391bfbf8a2e3ccf'], cost:77.5}],ownerIndex:5,userIndex:'53b88fbd248d1c4d7f9226c6'},
//{name:'FrederickGriefer',user:'53b88fdf248d1c4d7f9226c7',rank:[12],totalCap:283.5424,totalPlayers:18,cutPlayer:[],paidPlayer:[{name:'DF',roster:['53b9a18f3391bfbf8a2e3de0','53b9a18f3391bfbf8a2e3de1','53b9a18f3391bfbf8a2e3de2'], cost:3.03},{name:'K',roster:['53b9a18e3391bfbf8a2e3cab'], cost:1.1},{name:'QB',roster:['53b9a18d3391bfbf8a2e3c8d','53b9a18f3391bfbf8a2e3ddd','53b9a18f3391bfbf8a2e3ddf'], cost:60.6909},{name:'RB',roster:['53b9a18d3391bfbf8a2e3c23','53b9a18d3391bfbf8a2e3c4f','53b9a18d3391bfbf8a2e3c92','53b9a18f3391bfbf8a2e3dde'], cost:165.01},{name:'TE',roster:['53b9a18e3391bfbf8a2e3d13','53b9a18e3391bfbf8a2e3d27'], cost:4.1915},{name:'WR',roster:['53b9a18d3391bfbf8a2e3c3a','53b9a18d3391bfbf8a2e3c76','53b9a18e3391bfbf8a2e3c9d','53b9a18e3391bfbf8a2e3cdb','53b9a18f3391bfbf8a2e3ddc'], cost:49.52}],ownerIndex:6,userIndex:'53b88fdf248d1c4d7f9226c7'},
//{name:'GregFlowers',user:'53b88ff9248d1c4d7f9226c8',rank:[3],totalCap:293.69,totalPlayers:17,cutPlayer:[],paidPlayer:[{name:'K',roster:['53b9a18e3391bfbf8a2e3cae'], cost:1.1},{name:'QB',roster:['53b9a18d3391bfbf8a2e3c5f','53b9a18e3391bfbf8a2e3cbb'], cost:31.3},{name:'RB',roster:['53b9a18d3391bfbf8a2e3c1b','53b9a18d3391bfbf8a2e3c21','53b9a18e3391bfbf8a2e3cb1','53b9a18e3391bfbf8a2e3cc7','53b9a18f3391bfbf8a2e3de3'], cost:138.39},{name:'TE',roster:['53b9a18d3391bfbf8a2e3c85','53b9a18e3391bfbf8a2e3cc6'], cost:2.1},{name:'WR',roster:['53b9a18d3391bfbf8a2e3c27','53b9a18d3391bfbf8a2e3c36','53b9a18d3391bfbf8a2e3c37','53b9a18d3391bfbf8a2e3c39','53b9a18d3391bfbf8a2e3c3c','53b9a18d3391bfbf8a2e3c42','53b9a18d3391bfbf8a2e3c6b'], cost:120.8},{name:'DF',roster:[], cost:0}],ownerIndex:7,userIndex:'53b88ff9248d1c4d7f9226c8'},
//{name:'KevinQuencer',user:'53b8901b248d1c4d7f9226c9',rank:[1],totalCap:365.98,totalPlayers:17,cutPlayer:[],paidPlayer:[{name:'DF',roster:['53b9a18f3391bfbf8a2e3de4','53b9a18f3391bfbf8a2e3de5'], cost:2.02},{name:'QB',roster:['53b9a18d3391bfbf8a2e3c20','53b9a18d3391bfbf8a2e3c48'], cost:98.3},{name:'RB',roster:['53b9a18d3391bfbf8a2e3c25','53b9a18d3391bfbf8a2e3c2f','53b9a18d3391bfbf8a2e3c32','53b9a18d3391bfbf8a2e3c73','53b9a18d3391bfbf8a2e3c83','53b9a18e3391bfbf8a2e3cb4','53b9a18e3391bfbf8a2e3d06'], cost:122.41},{name:'TE',roster:['53b9a18d3391bfbf8a2e3c22','53b9a18e3391bfbf8a2e3d11'], cost:73.9},{name:'WR',roster:['53b9a18d3391bfbf8a2e3c33','53b9a18d3391bfbf8a2e3c50','53b9a18d3391bfbf8a2e3c5e','53b9a18e3391bfbf8a2e3d1a'], cost:69.35},{name:'K',roster:[], cost:0}],ownerIndex:8,userIndex:'53b8901b248d1c4d7f9226c9'},
//{name:'RossBramlet',user:'53b8903c248d1c4d7f9226ca',rank:[9],totalCap:325.3005,totalPlayers:17,cutPlayer:[],paidPlayer:[{name:'DF',roster:['53b9a18f3391bfbf8a2e3de6','53b9a18f3391bfbf8a2e3de8'], cost:2.02},{name:'K',roster:['53b9a18e3391bfbf8a2e3caa'], cost:1.1},{name:'QB',roster:['53b9a18e3391bfbf8a2e3c9f','53b9a18e3391bfbf8a2e3d05'], cost:105.04},{name:'RB',roster:['53b9a18d3391bfbf8a2e3c1a','53b9a18d3391bfbf8a2e3c1c','53b9a18e3391bfbf8a2e3cff'], cost:138.01},{name:'TE',roster:['53b9a18e3391bfbf8a2e3cbc'], cost:1.1},{name:'WR',roster:['53b9a18d3391bfbf8a2e3c3f','53b9a18d3391bfbf8a2e3c67','53b9a18d3391bfbf8a2e3c72','53b9a18e3391bfbf8a2e3ca1','53b9a18e3391bfbf8a2e3cf3','53b9a18e3391bfbf8a2e3d19','53b9a18e3391bfbf8a2e3d2a','53b9a18f3391bfbf8a2e3de7'], cost:78.0305}],ownerIndex:9,userIndex:'53b8903c248d1c4d7f9226ca'},
//{name:'NishNarenchania',user:'53b8905d248d1c4d7f9226cb',rank:[7],totalCap:385.3968,totalPlayers:19,cutPlayer:[],paidPlayer:[{name:'DF',roster:['53b9a18f3391bfbf8a2e3dea','53b9a18f3391bfbf8a2e3dec'], cost:2.02},{name:'K',roster:['53b9a18e3391bfbf8a2e3d24'], cost:1.1},{name:'QB',roster:['53b9a18d3391bfbf8a2e3c8e','53b9a18e3391bfbf8a2e3cb0','53b9a18e3391bfbf8a2e3cc0','53b9a18e3391bfbf8a2e3cfe'], cost:75.9118},{name:'RB',roster:['53b9a18d3391bfbf8a2e3c41','53b9a18d3391bfbf8a2e3c4b','53b9a18d3391bfbf8a2e3c60','53b9a18d3391bfbf8a2e3c6f'], cost:93.5},{name:'TE',roster:['53b9a18d3391bfbf8a2e3c34','53b9a18f3391bfbf8a2e3de9'], cost:6.655},{name:'WR',roster:['53b9a18d3391bfbf8a2e3c1f','53b9a18d3391bfbf8a2e3c43','53b9a18d3391bfbf8a2e3c57','53b9a18e3391bfbf8a2e3c9e','53b9a18e3391bfbf8a2e3caf','53b9a18e3391bfbf8a2e3d1c'], cost:206.21}],ownerIndex:10,userIndex:'53b8905d248d1c4d7f9226cb'},
//{name:'DavidMilliner',user:'53b8907a248d1c4d7f9226cc',rank:[8],totalCap:305.79,totalPlayers:21,cutPlayer:[],paidPlayer:[{name:'DF',roster:['53b9a18f3391bfbf8a2e3def','53b9a18f3391bfbf8a2e3df0','53b9a18f3391bfbf8a2e3df1','53b9a18f3391bfbf8a2e3df2'], cost:4.04},{name:'K',roster:['53b9a18e3391bfbf8a2e3ca9'], cost:1.1},{name:'QB',roster:['53b9a18d3391bfbf8a2e3c3e','53b9a18f3391bfbf8a2e3deb','53b9a18f3391bfbf8a2e3ded','53b9a18f3391bfbf8a2e3dee'], cost:88.13},{name:'RB',roster:['53b9a18d3391bfbf8a2e3c1e','53b9a18d3391bfbf8a2e3c38','53b9a18d3391bfbf8a2e3c51','53b9a18d3391bfbf8a2e3c74'], cost:111.1},{name:'TE',roster:['53b9a18e3391bfbf8a2e3ca2','53b9a18e3391bfbf8a2e3ce0'], cost:2},{name:'WR',roster:['53b9a18d3391bfbf8a2e3c2d','53b9a18d3391bfbf8a2e3c55','53b9a18d3391bfbf8a2e3c59','53b9a18d3391bfbf8a2e3c82','53b9a18e3391bfbf8a2e3c95','53b9a18e3391bfbf8a2e3cb8'], cost:99.42}],ownerIndex:11,userIndex:'53b8907a248d1c4d7f9226cc'}
//];

// Owners controller
angular.module('owners').controller('OwnersController', ['$scope', '$stateParams', '$location', 'Authentication', 'Owners', '$modal', '$http',
	function($scope, $stateParams, $location, Authentication, Owners, $modal, $http ) {
		$scope.authentication = Authentication;        
        
        /************
        METRICS
        *************/
        //get the total number of players
        $scope.totalPlayers = function(owner){
            var totPlayer=0;
            for(var i=0; i<owner.paidPlayer.length;i++){
                totPlayer+=owner.paidPlayer[i].roster.length;
            }
            return totPlayer
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
        $scope.salaryPosition = function(){
            
        };
                
        //get the end rank of the selected owner - for sorting
        $scope.endRank=function(selectedOwner){
          return selectedOwner.rank[0];  
        };
        
        
        $scope.showRoster=function(ownerId){
            $location.path('review-roster/' + ownerId);            
        };        
        
        /******
        EDIT PAGE MAIN FUNCTIONALITY
        ******/
		// Update existing Owner
		$scope.update = function() {
			var owner = $scope.owner ;

			owner.$update(function() {
				$location.path('owners/' + owner._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

        /******
        INITIALIZATION FOR MAIN PAGE
        ******/
		// Find a list of Owners
		$scope.find = function() {
			$scope.owners = Owners.query();
		};
        
        /*******
        INITIALIZATION FOR ROSTER REVIEW PAGE
        ******/
		// Find existing Owner
		$scope.findOne = function() {
			$scope.owner = Owners.get({ 
				ownerId: $stateParams.ownerId
			});
		};
        
        /*****
        NOT USED ANYMROE
        *****/
		// Remove existing Owner
		$scope.remove = function( owner ) {
			if ( owner ) { owner.$remove();

				for (var i in $scope.owners ) {
					if ($scope.owners [i] === owner ) {
						$scope.owners.splice(i, 1);
					}
				}
			} else {
				$scope.owner.$remove(function() {
					$location.path('owners');
				});
			}
		};        
        
		// Create new Owner
		$scope.create = function() {
			// Create new Owner object
			var owner = new Owners ({
				name: this.name
			});

			// Redirect after save
			owner.$save(function(response) {
				$location.path('owners/' + response._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});

			// Clear form fields
			this.name = '';
		};        
        
        /********
        MANUAL FUNCTIONS - FOR ADMIN USE
        ********/
        //Create players from JSON
//        $scope.createFromJson = function(){
//            
//            $scope.ownerJson=testOwner;  
//            
//            angular.forEach($scope.ownerJson, function(ownerProfile){
//                var owner = new Owners({
//                    name: ownerProfile.name,
//                    userIndex:ownerProfile.user,
//                    rank:ownerProfile.rank,
//                    totalCap:ownerProfile.totalCap,
//                    totalPlayers:ownerProfile.totalPlayers,
//                    cutPlayer:ownerProfile.cutPlayer,
//                    paidPlayer:ownerProfile.paidPlayer                    
//                });
//                
//                console.log(owner.name);
//                
//                owner.$save(function(response) {
//                    //$location.path('players/' + response._id);
//                }, function(errorResponse) {
//                    $scope.error = errorResponse.data.message;
//                    console.log($scope.error);
//                });
//            });            
//        };           
        
        //add a cut player to a given owner
        $scope.addCutPlayer=function(){
            var reqBody={};
            reqBody.ownerId='53b9dac03391bfbf8a2e3e4b';
            reqBody.cutPlayer=['53c28b7827d616c52465e951'];
            $http.put('http://localhost:3000/addCutPlayer',reqBody).
                success(function(data, status){
                    console.log(data);
                });            
        };
        
	}
]);