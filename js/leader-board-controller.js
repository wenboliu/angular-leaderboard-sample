angular.module("leaderBoardApp", [])
    .controller("LeaderBoardController", function ($scope, $http, $interval) {
	refresh();    
        $interval(function(){
	   refresh();
        }, 30000);

	function refresh() {
          $http.get("/api").success(function(data){	
            console.log(data);
	    $scope.items = data;
          });
	}
    });
