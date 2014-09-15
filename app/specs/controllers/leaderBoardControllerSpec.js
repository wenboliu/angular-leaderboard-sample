var leaderBoardController = require('../../scripts/controllers/leaderBoardController'); 
describe('leaderBoardController', function() {
        
	it('should be loaded with correct status', function() { 
		fixturesUtils.loadFixture('<div id="items" style="display:none"></div>');
		var scope = {};
		var interval = function(callback){}
		var apiService = jasmine.createSpyObj('apiService', ['refresh']);
		leaderBoardController(scope, interval, apiService);

		expect(angular.element('#items').is(':visible')).toBe(true);
		fixturesUtils.removeFixture('#items');
	});
});
