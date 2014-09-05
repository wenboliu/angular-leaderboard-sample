/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    // Task configuration.
    bower: {
      install: {
        options: {
          targetDir: './js/lib',
          layout: 'byComponent',
          install: true,
          verbose: false,
          cleanTargetDir: false,
          cleanBowerDir: false,
          bowerOptions: {}
        }
      }
    },
    less: {
      development: {
        files: {
          "css/leaderboard.css": "css/leaderboard.less"
        }
      },
      production: {
        files: {
          "css/leaderboard.css": "css/leaderboard.less"
       }
     }
    },
    karma: {
      unit: {
        configFile: 'karma.conf.js'
      },
      ci: {
        configFile: 'karma.conf.js',
	singleRun: true
      }
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-bower-task');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-karma');

  // Default task.
  grunt.registerTask('default', ['less', 'bower', 'karma:ci']);
  grunt.registerTask('heroku:production', ['less', 'bower', 'karma:ci']);

};
