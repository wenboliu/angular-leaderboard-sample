var tests = Object.keys(window.__karma__.files).filter(function (file) {
    return (/\.test\.js$/).test(file);
});

requirejs.config({
    baseUrl: './js',
    paths: {
    angular: 'lib/angular/angular',
    jquery: 'lib/jquery/jquery',
    bootstrap: 'lib/bootstrap/bootstrap',
    'angular-animate': 'lib/angular-animate/angular-animate',
    'angular-resource': 'lib/angular-resource/angular-resource',
    'angular-mocks': 'lib/angular-mocks/angular-mocks',
    background: 'background',
    leaderboard: 'leader-board-controllers'
  },
  shim: {
    angular: {  
      deps: ["jquery"],
      exports: 'angular'}, 
    'angular-mocks': {deps: ['angular'], 'exports': 'angular.mock'},
    'angular-resource': {
      deps: ["angular"],
      exports: 'angular-resource'
    }
  },
  packages: [

  ],
    // Ask Require.js to load these files (all our tests).
    deps: tests,
    // Set test to start run once Require.js is done.
    callback: window.__karma__.start
});
