'use strict';
var app = angular.module('appTime',[]);

function countController($scope, $interval){
	$scope.showDay = false;
	$scope.countDown = Math.floor((time_stop - currentDate)/1000);
    var currentDate = new Date();
    var time_stop = new Date(2014, 8, 8, 15, 30);
    var remiander;
    if ($scope.countDown > 0){
        $interval(function(){
        	$scope.countDown--
        	$scope.days = Math.floor($scope.countDown / 86400);
            remiander = $scope.countDown % 86400;

        	if($scope.days >= 2){
        		$scope.showDay = true;
                $scope.hours = Math.floor(remiander / 3600)
        	}
            else{
                $scope.hours = Math.floor($scope.countDown / 3600)
            }
            if($scope.hours < 10){
                $scope.hours = '0'+$scope.hours;
            }
        	remiander = remiander % 3600;
        	$scope.mins = Math.floor(remiander / 60);
            if($scope.mins < 10){
                $scope.mins = '0'+$scope.mins;
            }
        	$scope.seconds = remiander % 60;
            if($scope.seconds < 10){
                $scope.seconds = '0'+$scope.seconds;
            }

        },1000,0);  
    }
    
}