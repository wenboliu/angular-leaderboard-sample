'use strict';
var angular = require('angular');
var $ = require('jquery');

$(function(){
	console.log('====================');
});
var leaderBoardController = require('./controllers/leaderBoardController');


var leaderBoardApp = angular.module('leaderBoardApp', []);
leaderBoardApp.controller('LeaderBoardController',leaderBoardController); 

angular.element('#tablelist').ready(function() {
	angular.bootstrap('#tablelist', ['leaderBoardApp']);
});
