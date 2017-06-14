module.exports = function(grunt) {
  // Do grunt-related things in here
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    sass: { // Task
      dist: { // Target
        options: { // Target options
          style: 'expanded'
        },
        files: { // Dictionary of files
          'css/style.css': 'dev/style.scss'
            // 'destination': 'source'
        }
      }
    },
    watch: {
      css: {
        files: 'dev/style.scss',
        tasks: ['sass'],
        options: {
          livereload: true,
        },
      },
    }
  });

  // Load the plugins for tasks
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Default task(s).
  grunt.registerTask('default', ['sass']);
};
