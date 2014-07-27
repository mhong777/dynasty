'use strict';

angular.module('owners').controller('AllownersController', ['$scope', '$stateParams', '$location', 'Authentication', 'Owners', '$modal', '$http',
	function($scope, $stateParams, $location, Authentication, Owners, $modal, $http ) {
		$scope.authentication = Authentication;        
        /******
        INITIALIZATION FOR MAIN PAGE
        ******/
		// Find a list of Owners
        $http.get('/owners').
            success(function(data, status){
                $scope.owners=data;
            });            
        
        $scope.endRank=function(selectedOwner){
          return selectedOwner.rank[0];  
        };            
        
        /******
        FUNCTION TO GO TO THE EDIT PAGE
        *******/
        $scope.editOwner = function(ownerId){
             window.location.href='#!/owners/' + ownerId + '/edit';
            return;

        };
        
        
	}
]);