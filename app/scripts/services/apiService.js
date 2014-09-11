var apiService = function($http) {
	return {refresh: function(callback){
		var result = {};
		        $http.get("/api").then(function (response) {
		        	result.data = response.data;
				result.status = true;
			},
			function () {
				result.status = false;
			}).then(function () {
				callback(result);
			});
		
	}};
};

module.exports = apiService;
