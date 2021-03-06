'use strict';

//Setting up route
angular.module('bids').config(['$stateProvider',
	function($stateProvider) {
		// Bids state routing
		$stateProvider.
		state('listBids', {
			url: '/bids',
			templateUrl: 'modules/bids/views/list-bids.client.view.html'
		}).
		state('createBid', {
			url: '/bids/create',
			templateUrl: 'modules/bids/views/create-bid.client.view.html'
		}).
		state('viewBid', {
			url: '/bids/:bidId',
			templateUrl: 'modules/bids/views/view-bid.client.view.html'
		}).
		state('editBid', {
			url: '/bids/:bidId/edit',
			templateUrl: 'modules/bids/views/edit-bid.client.view.html'
		});
	}
]);