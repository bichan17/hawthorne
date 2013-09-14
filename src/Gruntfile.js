module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    // compile SASS files
    compass: {
      debug:{
        options:{
          sassDir: 'style',
          cssDir: '../build/debug/style',
          outputStyle: 'expanded',
          noLineComments: false,
          force: true,
          relativeAssets: true,
          environment: 'development'
        }
      },
      deploy:{
        options:{
          sassDir: 'style',
          cssDir: '../build/deploy/style',
          outputStyle: 'compressed',
          noLineComments: true,
          force: true,
          relativeAssets: true,
          environment: 'production'
        }
      }
    },

    // watch file changes
    watch: {
      css:{
        files: ['style/*.scss'],
        tasks:['compass:debug']
      },
      html:{
        files: ['*.html'],
        tasks: ['copy:debug']
      }
    },

    // copy files
    copy: {
      debug: {
        files: [
          {
            expand: true,
            src: ['*.html'],
            dest: '../build/debug',
            filter: 'isFile'
          }
        ]
      },
      deploy: {
        files: [
          {
            expand: true,
            src: ['*.html'],
            dest: '../build/deploy',
            filter: 'isFile'
          }
        ]
      }
    },

    // web server
    connect: {
      debug: {
        options: {
          hostname: '*',
          port: 9001,
          base: '../build/debug/',
          keepalive: true
        }
      },
      deploy: {
        options: {
          hostname: '*',
          port: 9002,
          base: '../build/deploy/',
          keepalive: true
        }
      }
    },

    // clear output directories
    // TODO
    clean: {
      debug: {
        cwd: '../',
        src: ['../build/debug'],
        force: true
      },
      deploy: {
        cwd: '../',
        src: ['../build/deploy'],
        force: true
      }
    },

    // htmlmin
    htmlmin: {
      deploy: {
        options: {
          removeComments: true,
          collapseWhitespace: true
        },
        files: {
          // 'destination' : 'source'
          '../build/deploy/index.html': 'index.html'
        }
      }
    }
  });



  // Load the plugins
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');




  // Default task(s).
  grunt.registerTask('default', ['compass:debug','copy:debug']);
  // build/debug
  grunt.registerTask('build', ['compass:debug','copy:debug']);
  grunt.registerTask('preview', ['compass:debug','copy:debug','connect:debug']);
  // build/deploy
  grunt.registerTask('deploy', ['compass:deploy','copy:deploy','htmlmin']);
  grunt.registerTask('demo', ['compass:deploy','copy:deploy','htmlmin','connect:deploy']);

};
