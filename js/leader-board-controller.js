angular.module("leaderBoardApp", [])

    .controller("LeaderBoardController", function ($scope, $http, $interval) {
	refresh();    
        $interval(function(){
	   refresh();
        }, 3000);

	function refresh() {
          $scope.showListClassName = "row";
	  $scope.errorMessage = "";
          $http.get("/api").then(function(response){	
	    $scope.items = response.data;
          }, 
	  function(){
            $scope.errorMessage = "Error occurs when getting data from server!"
	  }).then(function(){
            $scope.showListClassName = "row show-list-change";
	  });
	}

    });