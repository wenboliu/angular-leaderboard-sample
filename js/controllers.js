'use strict';
var app = angular.module('appTime',[]);

function countController($scope, $interval){
	$scope.showDay = false;
    $scope.dataPrepared = "false";
    var currentDate = new Date();
    var timeStop = new Date(2014, 8, 8, 15, 30);
    var countDown = Math.floor((timeStop - currentDate)/1000);

    var remainder;
    if (countDown > 0){
        $interval(function(){
        	countDown--
        	$scope.days = Math.floor(countDown / 86400);
            remainder = countDown % 86400;

        	if($scope.days >= 2){
        		$scope.showDay = true;
                $scope.hours = ("0" +  Math.floor(remainder / 3600)).slice(-2);
        	}
            else{
                $scope.hours = ("0" + Math.floor($scope.countDown / 3600)).slice(-2);
            }

            $scope.hours = ("0" + $scope.hours).slice(-2);
        	remainder = remainder % 3600;
            $scope.mins = ("0" + Math.floor(remainder / 60)).slice(-2);
            $scope.seconds = ("0" + remainder % 60).slice(-2);

        },1000,0);  
    }
    
}