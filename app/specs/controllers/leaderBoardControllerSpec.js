var leaderBoardController = require('../../scripts/controllers/leaderBoardController'); 
var $ = require('jquery');
describe('leaderBoardController', function() {
        
	it('should be loaded with correct status', function() { 
		$('<div id="item" style="display:none"></div>').appendTo('body');
		var scope = {};
		var interval = function(callback){}
		var apiService = jasmine.createSpyObj('apiService', ['refresh']);
		leaderBoardController(scope, interval, apiService);

		expect(angular.element('#items').is(':visible')).toBe(true);
		$('#items').remove();
	});
});
