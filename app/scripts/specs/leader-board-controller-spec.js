define(['angular','angular-mocks','leaderboard'],function(leaderboard) {
	describe("leaderboard", function() {
		var mockScope = {};
		var controller;
		var backend;
		var mockInterval;
		var items = [
				{'first_name': 'fname1', 'last_name': 'lname1', 'time': 'time1'},
				{'first_name': 'fname2', 'last_name': 'lname1', 'time': 'time2'}
			];

		beforeEach(angular.mock.module("leaderBoardApp"));
		
		beforeEach(angular.mock.inject(function($httpBackend){
			backend = $httpBackend;
			backend.expect("GET", "/api").respond(items);
		}));

		beforeEach(angular.mock.inject(function($controller, $rootScope, $http, $interval){
			mockScope = $rootScope.$new;
			mockInterval = $interval;
			controller = $controller("LeaderBoardController", {$scope: mockScope, $http:$http, $interval: mockInterval});
			backend.flush();
		}));
		
		it("should get data Loaded flag when getting successful data", function() {
			expect(mockScope.dataLoaded).toBe(false);
		});

		it("should get list class name when getting successful data", function() {
			expect(mockScope.showListClassName).toBe('table-responsive show-list-change');
		});

		it("should get successful data", function() {
			expect(mockScope.items).toEqual(items);
		});

        it("should get errorMessage null when getting successful data", function() {
            expect(mockScope.errorMessage).toEqual(null);
        });

	});

    describe("leaderboard failure", function() {
        var mockScope = {};
        var controller;
        var backend;
        var mockInterval;

        beforeEach(angular.mock.module("leaderBoardApp"));

        beforeEach(angular.mock.inject(function($httpBackend){
            backend = $httpBackend;
            backend.expect("GET", "/api").respond(500, '');
        }));

        beforeEach(angular.mock.inject(function($controller, $rootScope, $http, $interval){
            mockScope = $rootScope.$new;
            mockInterval = $interval;
            controller = $controller("LeaderBoardController", {$scope: mockScope, $http:$http, $interval: mockInterval});
            backend.flush();
        }));

        it("should get a valuable errorMessage when getting data failure", function() {
            expect(mockScope.errorMessage).toEqual("Error occurs when getting data from server!");
        });
    })
});
