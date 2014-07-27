'use strict';

//Players service used to communicate Players REST endpoints
angular.module('players').factory('Players', ['$resource',
	function($resource) {
		return $resource('players/:playerId', { playerId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);

angular.module('players').factory('socket', function(){
    var socket=io.connect('/');
    return socket;
});
