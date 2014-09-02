'use strict';
angular.module('appTime',[]);

function countController($scope, $interval){
	$scope.showDay = false;
    $scope.currentDate = new Date();
    $scope.time_stop = new Date(2014, 9, 8, 15, 30);
	$scope.countDown = ($scope.time_stop.getDate() - $scope.currentDate.getDate())*86400 + ($scope.time_stop.getHours() - $scope.currentDate.getHours())*3600 + ($scope.time_stop.getMinutes() - $scope.currentDate.getMinutes())*60 + ($scope.time_stop.getSeconds() - $scope.currentDate.getSeconds());
    var remiander;
    $interval(function(){
    	console.log($scope.countDown--)
    	$scope.days = Math.floor($scope.countDown / 86400);
    	if($scope.days >= 2){
    		$scope.showDay = true;
    	}
    	remiander = $scope.countDown % 86400;
    	$scope.hours = Math.floor(remiander / 3600)
    	remiander = remiander % 3600;
    	$scope.mins = Math.floor(remiander / 60);
    	$scope.seconds = remiander % 60;
    },1000,0);  
    
}