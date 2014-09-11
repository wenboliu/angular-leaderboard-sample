'use strict';
window.jQuery = require('jquery');
var angular = require('angular');
var leaderBoardApp = angular.module('leaderBoardApp', []);

var timerService = require('./services/timerService');
leaderBoardApp.factory('timerService', timerService);
var apiService = require('./services/apiService');
leaderBoardApp.factory('apiService', apiService);


var timerDirective = require('./directives/leaderBoardTimerDirective');
leaderBoardApp.directive('timer', timerDirective);


var leaderBoardController = require('./controllers/leaderBoardController');
leaderBoardApp.controller('LeaderBoardController',leaderBoardController); 
leaderBoardApp.controller('timerCtrl', function(){});
