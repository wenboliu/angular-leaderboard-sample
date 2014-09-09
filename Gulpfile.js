var gulp = require('gulp'),
    gutil = require('gulp-util'),
    jshint = require('gulp-jshint'),
    browserify = require('gulp-browserify'),
    concat = require('gulp-concat'),
    clean = require('gulp-clean');

// JSHint task
gulp.task('lint', function() {
  gulp.src('./app/scripts/*.js')
  .pipe(jshint())
  // You can look into pretty reporters as well, but that's another story
  .pipe(jshint.reporter('default'));
});

// Browserify task
gulp.task('browserify', function() {
  // Single point of entry (make sure not to src ALL your files, browserify will figure it out for you)
  gulp.src(['app/scripts/main.js'])
  .pipe(browserify({
    insertGlobals: true,
    debug: true
  }))
  // Bundle to a single file
  .pipe(concat('bundle.js'))
  // Output it to our dist folder
  .pipe(gulp.dest('dist/js'));
  
  gulp.src(['app/scripts/lib/ie/*'])
      .pipe(gulp.dest('dist/js/ie'));
  
  gulp.src(['app/scripts/lib/responsive/*'])
      .pipe(gulp.dest('dist/js/responsive'));
});

gulp.task('copy', function(){
  gulp.src(['app/scripts/lib/ie/*'])
      .pipe(gulp.dest('dist/js/ie'));
  
  gulp.src(['app/scripts/lib/responsive/*'])
      .pipe(gulp.dest('dist/js/responsive'));

  gulp.src(['app/images/*'])
      .pipe(gulp.dest('dist/images'));
      
  gulp.src(['app/styles/*.css'])
      .pipe(gulp.dest('dist/css'));
  
});

var less = require('gulp-less');
var autoprefixer = require('gulp-autoprefixer');
// Styles task
gulp.task('styles', function() {
  gulp.src('app/styles/*.less')
  // The onerror handler prevents Gulp from crashing when you make a mistake in your SASS
  .pipe(less({onError: function(e) { console.log(e); } }))
  // Optionally add autoprefixer
  .pipe(autoprefixer("last 2 versions", "> 1%", "ie 8"))
  // These last two should look familiar now :)
  .pipe(gulp.dest('dist/css/'))
  .pipe(refresh(lrserver));
});

gulp.task('watch', ['lint', 'copy', 'views'], function() {
  // Watch our scripts
  gulp.watch(['app/scripts/*.js', 'app/scripts/**/*.js'],[
    'lint',
    'browserify'
  ]);
  gulp.watch(['app/styles/**/*.less'], [
    'styles'
  ]);
});

var embedlr = require('gulp-embedlr'),
    refresh = require('gulp-livereload'),
    lrserver = require('tiny-lr')(),
    express = require('express'),
    livereload = require('connect-livereload'),
    livereloadport = 35729,
    serverport = 5000;

// Set up an express server (but not starting it yet)
var server = express();
// Add live reload
server.use(livereload({port: livereloadport}));
// Use our 'dist' folder as rootfolder
server.use(express.static('./dist'));
// Because I like HTML5 pushstate .. this redirects everything back to our index.html
server.all('/api', function(request, response) {
    var http = require('http');
    http.get('http://material-code.appspot.com/test/api', function (res) {
        res.on("data", function (chunk) {
            response.end(chunk)
        });
    }).on('error', function (e) {
        console.log("Got error: " + e.message);
        response.writeHead(500, '', {'content-type': 'text/plain'});
    });
});

server.all('/*', function(req, res) {
    res.sendFile('index.html', { root: 'dist' });
});

// Dev task
gulp.task('dev', function() {
  // Start webserver
  server.listen(serverport);
  // Start live reload
  lrserver.listen(livereloadport);
  // Run the watch task, to keep taps on changes
  gulp.run('watch');
});

gulp.task('views', function() {
  gulp.src('./app/index.html')
  .pipe(gulp.dest('dist/'));

  gulp.src('./app/views/**/*')
  .pipe(gulp.dest('dist/views/'))
  .pipe(refresh(lrserver)); // Tell the lrserver to refresh
});
