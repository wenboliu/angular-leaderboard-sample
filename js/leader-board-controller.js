angular.module("leaderBoardApp", [])
    .controller("LeaderBoardController", function ($scope, $http, $interval) {
        refresh();
        $interval(function () {
            $scope.dataLoaded = true;
            refresh();
        }, 30000);

        function refresh() {
            $http.get("/api").success(function (data) {
                $scope.dataLoaded = false;
                $scope.items = data;
            });
        }
    });
