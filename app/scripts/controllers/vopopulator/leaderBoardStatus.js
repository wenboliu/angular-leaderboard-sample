var leaderBoardStatus = function(scope, tableClassName, dataLoaded, errorMessage, data) {
	scope.dataLoaded = dataLoaded;
	scope.showListClassName = tableClassName;
	scope.errorMessage = data? null : errorMessage;
	scope.items = data;

};

module.exports = leaderBoardStatus;
