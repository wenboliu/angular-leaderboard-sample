var gulp = require('gulp'),
    gutil = require('gulp-util'),
    jshint = require('gulp-jshint'),
    browserify = require('browserify'),
    concat = require('gulp-concat'),
    inject = require("gulp-inject"),
    source = require('vinyl-source-stream'),
    streamify = require('gulp-streamify'),
    ngHtml2Js = require("gulp-ng-html2js"),
    karma = require('gulp-karma'),
    clean = require('gulp-clean');

gulp.task('clean', function() {
  gulp.src(['./dist/**/*',
	    './build/**/*'])
  .pipe(clean())
  // You can look into pretty reporters as well, but that's another story
  .pipe(jshint.reporter('default'));
});

// JSHint task
gulp.task('lint', function() {
  gulp.src('./app/scripts/*.js')
  .pipe(jshint())
  // You can look into pretty reporters as well, but that's another story
  .pipe(jshint.reporter('default'));
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

  gulp.src(['app/scripts/views/*'])
      .pipe(gulp.dest('dist/views'));
  
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
  .pipe(gulp.dest('dist/css/'));
//  .pipe(refresh(lrserver));
});


/**
* Introspect for tests and create test entrypoint js file for Browserify
*/
gulp.task('create-tests', function() {
    return gulp.src('./app/specs/specs.js')
        .pipe(inject(gulp.src(["./app/specs/controllers/*Spec.js"], {
            read: false
        }), {
            transform: function(filepath) {
                return "require('.." + filepath + "');"
            },
            starttag: "/* inject:js */",
            endtag: "/* endinject */"
        }))
        .pipe(gulp.dest('./build'));
});

/**
* Browserify tests
*/
gulp.task('browserify-tests', ['create-tests'], function() {

    return browserify('./build/specs.js')
    .bundle() 
    .pipe(source('../specs.js'))
    .pipe(gulp.dest('./build/specs.js'));

});

/**
* Convert the html partials into js file to be required into Browserify
*/
gulp.task('test-templates', function() {

    return gulp.src("./app/scripts/**/*.tpl.html")
        /*.pipe(minifyHtml({
            empty: true,
            spare: true,
            quotes: true
        }))*/
        .pipe(ngHtml2Js({
            stripPrefix: "app/"
        }))
        .pipe(concat("templates.js"))
        //.pipe(uglify())
        .pipe(gulp.dest("./build")); // Always store the compiled templates in build folder as need single location for require statement. Don't want to put into src folder.

});

/**
* Browserify tests
*/
gulp.task('browserify-tests', ['create-tests', 'test-templates'], function() {

    return browserify(['./build/specs.js',
	               './build/templates.js'])
    .bundle() 
    .pipe(source('../specs.js'))
    .pipe(gulp.dest('./build/specs.js'));

});

/**
* Run tests
*/
gulp.task('test', ['browserify-tests'], function() {

    return gulp.src(['./build/specs.js'])
        .pipe(karma({
            configFile: 'karma.conf.js',
            action: 'run'
        }));
});
/*var embedlr = require('gulp-embedlr'),
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
});*/

gulp.task('views', function() {
  gulp.src('./app/index.html')
  .pipe(gulp.dest('dist/'));

  gulp.src('./app/views/**/*')
  .pipe(gulp.dest('dist/views/'));
  //.pipe(refresh(lrserver)); // Tell the lrserver to refresh
});

/**
* Convert the html partials into js file to be required into Browserify
*/
gulp.task('templates', function() {

    return gulp.src("./app/scripts/**/*.tpl.html")
        /*.pipe(minifyHtml({
            empty: true,
            spare: true,
            quotes: true
        }))*/
        .pipe(ngHtml2Js({
            stripPrefix: "app/"
        }))
        .pipe(concat("templates.js"))
        //.pipe(uglify())
        .pipe(gulp.dest("./dist/js")); // Always store the compiled templates in build folder as need single location for require statement. Don't want to put into src folder.

});

/**
* Convert the html partials into js file to be required into Browserify
*/
gulp.task('browserify', function() {

     // Single point of entry (make sure not to src ALL your files, browserify will figure it out for you)
   return browserify('./app/scripts/main.js')
    .bundle() 
    .pipe(source('../bundle.js'))
    .pipe(gulp.dest('./dist/js/bundle.js'));
});

// Browserify task
gulp.task('js', ['browserify', 'templates'], function() {
  // Single point of entry (make sure not to src ALL your files, browserify will figure it out for you)
  gulp.src(['dist/js/bundle.js',
	    'dist/js/templates.js'])
  // Bundle to a single file
  .pipe(concat('bundle.js'))
  // Output it to our dist folder
  .pipe(gulp.dest('dist/js'));
});

gulp.task('build', ['lint', 'js', 'styles', 'copy', 'views'], function() {
});


gulp.task('watch', ['lint', 'js', 'styles', 'copy', 'views'], function() {
  // Watch our scripts
  gulp.watch(['app/scripts/*.js', 'app/scripts/**/*.js'],[
    'lint',
    'browserify'
  ]);
  gulp.watch(['app/styles/**/*.less'], [
    'styles'
  ]);
});
