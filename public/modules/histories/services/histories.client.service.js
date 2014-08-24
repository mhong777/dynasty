'use strict';

//Histories service used to communicate Histories REST endpoints
angular.module('histories').factory('Histories', ['$resource',
	function($resource) {
		return $resource('histories/:historyId', { historyId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);