module.exports = function(grunt) {

  grunt.initConfig({
    concat: {
      options: {
        separator: ''
      },
      dist: {
        src: ['i/js/o2mdb.js','i/js/lib/*.js','i/js/classes/*.js','i/js/build.js'],
        dest: 'i/js/compiled.js'
      }
    },
    watch: {
      files: ['i/js/o2mdb.js','i/js/lib/*.js','i/js/classes/*.js','i/js/build.js'],
      tasks: ['concat'],
      // tasks: ['concat','closure-compiler'],
      options: {
        // Start another live reload server on port 1337
        livereload: 1337
      }
    },
    'closure-compiler': {
      frontend: {
        closurePath: '.',
        js: 'i/js/compiled.js',
        jsOutputFile: 'i/build.min.js',
        maxBuffer: 500,
        noreport: true,
        options: {
          compilation_level: 'SIMPLE_OPTIMIZATIONS',
          // compilation_level: 'ADVANCED_OPTIMIZATIONS',
          language_in: 'ECMASCRIPT5_STRICT'
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-closure-compiler');

  grunt.registerTask('default', ['watch','concat']);

};