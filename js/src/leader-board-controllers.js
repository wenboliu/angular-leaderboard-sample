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

	angular.element('#tablelist').ready(function() {
		angular.bootstrap('#tablelist', ['leaderBoardApp']);
	});
});
