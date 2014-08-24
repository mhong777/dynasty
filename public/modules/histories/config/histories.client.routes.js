'use strict';

//Setting up route
angular.module('histories').config(['$stateProvider',
	function($stateProvider) {
		// Histories state routing
		$stateProvider.
		state('listHistories', {
			url: '/histories',
			templateUrl: 'modules/histories/views/list-histories.client.view.html'
		}).
		state('createHistory', {
			url: '/histories/create',
			templateUrl: 'modules/histories/views/create-history.client.view.html'
		}).
		state('viewHistory', {
			url: '/histories/:historyId',
			templateUrl: 'modules/histories/views/view-history.client.view.html'
		}).
		state('editHistory', {
			url: '/histories/:historyId/edit',
			templateUrl: 'modules/histories/views/edit-history.client.view.html'
		});
	}
]);