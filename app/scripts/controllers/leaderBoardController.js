var $ = require('jquery');
var angular = require('angular');
var angularResource = require('angular-resource');

var leaderBoardController = function ($scope, $http, $interval) {
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
};

module.exports = leaderBoardController;
