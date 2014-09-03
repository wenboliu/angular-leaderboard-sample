angular.module("leaderBoardApp", [])
    .controller("LeaderBoardController", function ($scope, $http, $interval) {
        refresh();
        $interval(function () {
            $scope.dataLoaded = true;
            refresh();
        }, 30000);
        function refresh() {
            $scope.showListClassName = "row";
            $scope.errorMessage = "";
            $http.get("/api").then(function (response) {
                    $scope.dataLoaded = false;

                    $scope.items = response.data;
                },
                function () {
                    $scope.errorMessage = "Error occurs when getting data from server!"
                }).then(function () {
                    $scope.showListClassName = "show-list-change";
                });
        }
    });