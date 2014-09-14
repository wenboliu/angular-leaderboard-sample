var timer = function($interval, timerService){
	return {link: function(scope, element, attrs){
		var cssSelector = attrs['timer'];
		angular.element("." + cssSelector).show();
		scope.showDay = false;

		$interval(function(){
			var currentDate = new Date();
			var timeStop = new Date(2014, 8, 8, 15, 30);
			var time = timerService.calculateDistance(timeStop, currentDate);
			scope.days = time.days;
			scope.showDay = scope.days > 0;
			scope.hours = ("0" + time.hours).slice(-2);
			scope.mins = ("0" + time.minutes).slice(-2);
			scope.seconds = ("0" + time.seconds).slice(-2)

		},1000,0);  
	},
	       restrict:'A',
	       templateUrl: "views/timer.tpl.html",
	       scope: true}};

module.exports = timer;

