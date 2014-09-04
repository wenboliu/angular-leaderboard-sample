define('leaderboard', ['angular', 'angular-resource'], function(angular) {
	var leaderBoardApp = angular.module("leaderBoardApp", []);
	leaderBoardApp.controller("LeaderBoardController", function ($scope, $http, $interval) {
		refresh();
		$interval(function () {
			refresh();
		}, 10000);
		function refresh() {
			angular.element('#items').show();
			$scope.showListClassName = "hidden";
			$scope.dataLoaded = true;
			$scope.showListClassName = "table-responsive";
			$scope.errorMessage = null;
			$http.get("/api").then(function (response) {
				$scope.items = response.data;
			},
			function () {
				$scope.errorMessage = "Error occurs when getting data from server!"
			}).then(function () {
				$scope.dataLoaded = false;
				$scope.showListClassName = "table-responsive show-list-change";
			});
		}
	});

	leaderBoardApp.controller('countController', function($scope, $interval){
		angular.element('#time').show();
		$scope.showDay = false;

		var currentDate = new Date();
		var timeStop = new Date(2014, 8, 8, 15, 30);
		var countDown = Math.floor((timeStop - currentDate)/1000);

		var remiander;
		if (countDown > 0){
			$interval(function(){
				countDown--;
				$scope.days = Math.floor(countDown / 86400);
				remiander = countDown % 86400;

				if($scope.days >= 2){
					$scope.showDay = true;
					$scope.hours = ("0" +  Math.floor(remiander / 3600)).slice(-2);
				}
				else{
					$scope.hours = ("0" + Math.floor($scope.countDown / 3600)).slice(-2);
				}

			$scope.hours = ("0" + $scope.hours).slice(-2);
			remiander = remiander % 3600;
			$scope.mins = ("0" + Math.floor(remiander / 60)).slice(-2);
			$scope.seconds = ("0" + remiander % 60).slice(-2);

			},1000,0);  
		}

	});


	angular.element('#leaderBoardApp').ready(function() {
		angular.bootstrap('#leaderBoardApp', ['leaderBoardApp']);
	});
});
