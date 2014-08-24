'use strict';

(function() {
	// Histories Controller Spec
	describe('Histories Controller Tests', function() {
		// Initialize global variables
		var HistoriesController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Histories controller.
			HistoriesController = $controller('HistoriesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one History object fetched from XHR', inject(function(Histories) {
			// Create sample History using the Histories service
			var sampleHistory = new Histories({
				name: 'New History'
			});

			// Create a sample Histories array that includes the new History
			var sampleHistories = [sampleHistory];

			// Set GET response
			$httpBackend.expectGET('histories').respond(sampleHistories);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.histories).toEqualData(sampleHistories);
		}));

		it('$scope.findOne() should create an array with one History object fetched from XHR using a historyId URL parameter', inject(function(Histories) {
			// Define a sample History object
			var sampleHistory = new Histories({
				name: 'New History'
			});

			// Set the URL parameter
			$stateParams.historyId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/histories\/([0-9a-fA-F]{24})$/).respond(sampleHistory);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.history).toEqualData(sampleHistory);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Histories) {
			// Create a sample History object
			var sampleHistoryPostData = new Histories({
				name: 'New History'
			});

			// Create a sample History response
			var sampleHistoryResponse = new Histories({
				_id: '525cf20451979dea2c000001',
				name: 'New History'
			});

			// Fixture mock form input values
			scope.name = 'New History';

			// Set POST response
			$httpBackend.expectPOST('histories', sampleHistoryPostData).respond(sampleHistoryResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the History was created
			expect($location.path()).toBe('/histories/' + sampleHistoryResponse._id);
		}));

		it('$scope.update() should update a valid History', inject(function(Histories) {
			// Define a sample History put data
			var sampleHistoryPutData = new Histories({
				_id: '525cf20451979dea2c000001',
				name: 'New History'
			});

			// Mock History in scope
			scope.history = sampleHistoryPutData;

			// Set PUT response
			$httpBackend.expectPUT(/histories\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/histories/' + sampleHistoryPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid historyId and remove the History from the scope', inject(function(Histories) {
			// Create new History object
			var sampleHistory = new Histories({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Histories array and include the History
			scope.histories = [sampleHistory];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/histories\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleHistory);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.histories.length).toBe(0);
		}));
	});
}());