'use strict';
window.jQuery = require('jquery');
var angular = require('angular');

var leaderBoardApp = angular.module('leaderBoardApp', []);

var leaderBoardController = require('./controllers/leaderBoardController');
leaderBoardApp.controller('LeaderBoardController',leaderBoardController); 

var timerDirective = require('./directives/leaderBoardTimerDirective');
leaderBoardApp.directive('timer', timerDirective);

leaderBoardApp.controller('timerCtrl', function(){});
