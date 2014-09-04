requirejs.config({
  baseUrl: './js',
  paths: {
    angular: 'lib/angular/angular',
    jquery: 'lib/jquery/jquery',
    bootstrap: 'lib/bootstrap/bootstrap',
    'angular-animate': 'lib/angular-animate/angular-animate',
    'angular-resource': 'lib/angular-resource/angular-resource',
    background: 'background',
    leaderboard: 'leader-board-controllers'
  },
  shim: {
    angular: {  
      deps: ["jquery"],
      exports: 'angular'}, 
    'angular-resource': {
      deps: ["angular"],
      exports: 'angular-resource'
    }
  },
  packages: [

  ]
});

requirejs(['background']);

requirejs(['leaderboard']);
