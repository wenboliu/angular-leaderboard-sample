angular.module("leaderBoardApp", [])
    .controller("LeaderBoardController", function ($scope, $http, $interval) {
        $http.get("http://localhost:1337/api").success(function(data){
            console.log(data);
        });
        $scope.items = [
            {"first_name": "Kelli", "last_name": "Guiney", "time": "01:00:58"},
            {"first_name": "Brett", "last_name": "Cooper", "time": "01:05:35"},
            {"first_name": "Felicity", "last_name": "White", "time": "01:07:15"},
            {"first_name": "Monty", "last_name": "Hamilton", "time": "01:08:05"},
            {"first_name": "Sarah", "last_name": "Battwraden", "time": "01:11:03"},
            {"first_name": "Bob", "last_name": "Reynolds", "time": "01:11:37"},
            {"first_name": "Mike", "last_name": "Baxter", "time": "01:14:14"},
            {"first_name": "Terry", "last_name": "Gillespie", "time": "01:14:15"},
            {"first_name": "Chris", "last_name": "Ford", "time": "01:22:27"},
            {"first_name": "Sunil", "last_name": "Samarasinghe", "time": "01:24:24"},
            {"first_name": "Dan", "last_name": "Martin", "time": "01:25:29"}
        ];
        $interval(function(){
            $scope.items;
        }, 30000);
    });