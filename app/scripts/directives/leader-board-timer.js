/*var leaderBoardApp = angular.module("leaderBoardTimerApp", []);

leaderBoardApp.directive('timer', function($interval){
	return {link: function(scope, element, attrs){
		var cssSelector = attrs['timer'];
		angular.element("." + cssSelector).show();
		scope.showDay = false;

		$interval(function(){
			var currentDate = new Date();
			var timeStop = new Date(2014, 8, 8, 15, 30);
			var time = calculateTimeDistance(timeStop, currentDate);
			scope.days = time.days;
			scope.showDay = scope.days > 0;
			scope.hours = ("0" + time.hours).slice(-2);
			scope.mins = ("0" + time.minutes).slice(-2);
			scope.seconds = ("0" + time.seconds).slice(-2)

		},1000,0);  

		function calculateTimeDistance(end, start) {
			var timeDistanceInSeconds = Math.floor((end - start) / 1000);
			var seconds = timeDistanceInSeconds % 60;
			var timeDistanceInMinute = Math.floor(timeDistanceInSeconds / 60);
			var minutes = timeDistanceInMinute % 60;
			var timeDistanceInHours = Math.floor(timeDistanceInMinute / 60);
			var hours = timeDistanceInHours;
			var days = 0;
			if(timeDistanceInHours > 48) {
				hours = timeDistanceInHours % 24;
				days = Math.floor(timeDistanceInHours / 24);
			}
			return {'days': days, 'hours': hours, 'minutes': minutes, 'seconds': seconds};
		}

	},
	       restrict:'A',
	       templateUrl: "/js/src/timer.html",
	       scope: true}}).controller('timerCtrl', function(){
	       });
angular.element('#secRow').ready(function() {
	angular.bootstrap('#secRow', ['leaderBoardTimerApp']);
});*/

