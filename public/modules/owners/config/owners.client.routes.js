'use strict';

//Setting up route
angular.module('owners').config(['$stateProvider',
	function($stateProvider) {
		// Owners state routing
		$stateProvider.
		state('draft-admin', {
			url: '/draft-admin',
			templateUrl: 'modules/owners/views/draft-admin.client.view.html'
		}).
		state('exec-bid', {
			url: '/exec-bid',
			templateUrl: 'modules/owners/views/exec-bid.client.view.html'
		}).
		state('draft', {
			url: '/draft',
			templateUrl: 'modules/owners/views/chat.client.view.html'
		}).
		state('chat', {
			url: '/chat',
			templateUrl: 'modules/owners/views/chat.client.view.html'
		}).
		state('allowners', {
			url: '/allowners',
			templateUrl: 'modules/owners/views/allowners.client.view.html'
		}).
		state('trade', {
			url: '/trade',
			templateUrl: 'modules/owners/views/trade.client.view.html'
		}).
		state('review-roster', {
			url: '/review-rosters/:ownerId',
			templateUrl: 'modules/owners/views/review-roster.client.view.html'
		}).
		state('listOwners', {
			url: '/owner',
			templateUrl: 'modules/owners/views/list-owners.client.view.html'
		}).
		state('createOwner', {
			url: '/owners/create',
			templateUrl: 'modules/owners/views/create-owner.client.view.html'
		}).
		state('viewOwner', {
			url: '/owners/:ownerId',
			templateUrl: 'modules/owners/views/view-owner.client.view.html'
		}).
		state('editOwner', {
			url: '/owners/:ownerId/edit',
			templateUrl: 'modules/owners/views/edit-owner.client.view.html'
		});
	}
]);