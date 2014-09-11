'use strict';
window.jQuery = require('jquery');
var angular = require('angular');

var leaderBoardController = require('./controllers/leaderBoardController');

var leaderBoardApp = angular.module('leaderBoardApp', []);
leaderBoardApp.controller('LeaderBoardController',leaderBoardController); 

angular.element('#tablelist').ready(function() {
	angular.bootstrap('#tablelist', ['leaderBoardApp']);
});
