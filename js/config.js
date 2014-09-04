requirejs.config({
  baseUrl: './js',

  paths: {
    angular: 'lib/angular/angular',
    jquery: 'lib/jquery/jquery',
    bootstrap: 'lib/bootstrap/bootstrap',
    'angular-animate': 'lib/angular-animate/angular-animate',
    'angular-resource': 'lib/angular-resource/angular-resource',
    leaderboard: 'src/leader-board-controllers',
  },

  shim: {
    angular: {  
      deps: ["jquery"],
      exports: 'angular'
    }, 
    'angular-resource': {
      deps: ["angular"],
      exports: 'angular-resource'
    }
  },
});

requirejs(['leaderboard']);
