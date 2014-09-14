var leaderBoardController = require('../../scripts/controllers/leaderBoardController'); 

describe('leaderBoardController', function() {
        
	beforeEach(module('views/timer.tpl.html'));

	it('should be loaded with correct status', function() { 
		var scope = {};
		var interval = function(callback){}
		var apiService = jasmine.createSpy();
		leaderBoardController(scope, interval, apiService);

		expect($('#items').css('display')).toBe('block');
	});
});
