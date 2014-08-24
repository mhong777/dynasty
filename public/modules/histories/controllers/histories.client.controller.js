'use strict';

// Histories controller
angular.module('histories').controller('HistoriesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Histories',
	function($scope, $stateParams, $location, Authentication, Histories ) {
		$scope.authentication = Authentication;

		// Create new History
		$scope.create = function() {
			// Create new History object
			var history = new Histories ({
				name: this.name
			});

			// Redirect after save
			history.$save(function(response) {
				$location.path('histories/' + response._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});

			// Clear form fields
			this.name = '';
		};

		// Remove existing History
		$scope.remove = function( history ) {
			if ( history ) { history.$remove();

				for (var i in $scope.histories ) {
					if ($scope.histories [i] === history ) {
						$scope.histories.splice(i, 1);
					}
				}
			} else {
				$scope.history.$remove(function() {
					$location.path('histories');
				});
			}
		};

		// Update existing History
		$scope.update = function() {
			var history = $scope.history ;

			history.$update(function() {
				$location.path('histories/' + history._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Histories
		$scope.find = function() {
			$scope.histories = Histories.query();
		};

		// Find existing History
		$scope.findOne = function() {
			$scope.history = Histories.get({ 
				historyId: $stateParams.historyId
			});
		};
	}
]);