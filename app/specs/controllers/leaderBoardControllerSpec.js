var leaderBoardController = require('../../scripts/controllers/leaderBoardController'); 

describe('leaderBoardController', function() {
	it('should be loaded with correct status', function() { 
		loadFixtures('<div id="items" style="display: none"></div>');
        var scope = {};
        var interval = function(callback){}
        var apiService = jasmine.createSpy();
        leaderBoardController(scope, interval, apiService);

        expect($('#items').css('display')).toBe('block');
	});
});
