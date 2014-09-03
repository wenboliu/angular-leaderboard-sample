'use strict';
var app = angular.module('appTime',[]);

function countController($scope, $interval){
	$scope.showDay = false;
    var currentDate = new Date();
    var timeStop = new Date(2014, 8, 8, 15, 30);
    $scope.countDown = Math.floor((timeStop - currentDate)/1000);

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

            $scope.hours = ("0" + $scope.hours).slice(-2);
        	remiander = remiander % 3600;
        	$scope.mins = Math.floor(remiander / 60);
            $scope.mins = ("0" + $scope.mins).slice(-2);
        	$scope.seconds = remiander % 60;
            $scope.seconds = ("0" + $scope.seconds).slice(-2);

        },1000,0);  
    }
    
}