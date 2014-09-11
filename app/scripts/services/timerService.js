var timerService = function() {
	return {calculateDistance: function(end, start){
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
	}};
};

module.exports = timerService;
