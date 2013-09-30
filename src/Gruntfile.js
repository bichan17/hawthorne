module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    // clear output directories
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

    // compile SASS files
    compass: {
      debug_base:{
        options:{
          sassDir: 'packages/base/style',
          cssDir: '../build/debug/style',
          outputStyle: 'expanded',
          noLineComments: false,
          force: true,
          relativeAssets: true,
          images: '../build/debug/img',
          environment: 'development'
        }
      },
      debug_modules:{
        options:{
          cssDir: '../build/debug/style/modules',
          importPath: 'packages/base/style',
          outputStyle: 'expanded',
          noLineComments: false,
          force: true,
          relativeAssets: true,
          images: '../build/debug/img',
          environment: 'development'
        }
      },
      deploy_base:{
        options:{
          sassDir: 'packages/base/style',
          cssDir: '../build/deploy/style',
          outputStyle: 'compressed',
          noLineComments: true,
          force: true,
          relativeAssets: true,
          images: '../build/deploy/img',
          environment: 'production'
        }
      },
      deploy_modules:{
        options:{
          cssDir: '../build/deploy/css/modules',
          importPath: 'packages/common/css',
          outputStyle: 'compressed',
          noLineComments: true,
          force: true,
          relativeAssets: true,
          images: '../build/deploy/img',
          environment: 'production'
        }
      },
      docs:{
        options:{
          sassDir: 'packages/docs/style',
          cssDir: '../docs/style',
          outputStyle: 'compressed',
          noLineComments: true,
          force: true,
          relativeAssets: true,
          images: '../docs/img',
          environment: 'production'
        }
      }
    },

    // copy files (font, js)
    copy: {
      debug_base : {
        files : [
          {expand: true, cwd: 'packages/base/fonts', src: ['**'], dest: '../build/debug/fonts'},
          {expand: true, cwd: 'packages/base/img', src: ['**'], dest: '../build/debug/img'},
          {expand: true, cwd: 'packages/base/js', src: ['**'], dest: '../build/debug/js'}
        ]
      },
      debug_modules : {
       // go through every module folder
        files : function() {
          var module, array = [];

          // copy all imgs
          grunt.file.expand('packages/modules/**/img/').forEach(function(path) {
            module = path.split('/')[2];
            array.push({expand: true, cwd: path, src: ['**'], dest: '../build/debug/img/'+module+'/'});
          });

          // copy all js
          grunt.file.expand('packages/modules/**/js/').forEach(function(path) {
            module = path.split('/')[2];
            array.push({expand: true, cwd: path, src: ['**'], dest: '../build/debug/js/modules/'+module+'/'});
          });
          return array;
        }
      },
      deploy_base : {
        files : [
          {expand: true, cwd: 'packages/base/fonts', src: ['**'], dest: '../build/deploy/fonts'},
          {expand: true, cwd: 'packages/base/img', src: ['**'], dest: '../build/deploy/img'},
          {expand: true, cwd: 'packages/base/js', src: ['**'], dest: '../build/deploy/js'}
        ]
      },
      deploy_modules : {
        files : function() {
          var module, array = [];

          // copy imgs
          grunt.file.expand('packages/modules/**/img/').forEach(function(path) {
            module = path.split('/')[2];
            array.push({expand: true, cwd: path, src: ['**'], dest: '../build/deploy/img/'+module+'/'});
          });
          return array;
        }
      },
      docs : {
        files: [
          {expand: true, cwd: 'packages/docs/img', src: ['**'], dest: '../docs/img'},
          {expand: true, cwd: 'packages/docs/js', src: ['**'], dest: '../docs/js'}
        ]
      }
    },

    // compile jade files
    jade: {
      debug_modules: {
        options: {data: {debug: false}},
        files:[
          {expand:true, cwd:'packages/modules/', src:['**/demo/*.jade'], dest:'../build/debug/', ext:'.html', flatten:true}
        ]
      },
      debug_pages: {
        options: {data: {debug: false}},
        files:[
          {expand:true, cwd:'packages/pages/', src:['*.jade'], dest:'../build/debug/', ext:'.html', flatten:true}
        ]
      },
      deploy_modules: {
        options: {data: {debug: false}},
        files:[
          {expand:true, cwd:'packages/modules/', src:['**/demo/*.jade'], dest:'../build/deploy/', ext:'.html', flatten:true}
        ]
      },
      deploy_pages: {
        options: {data: {debug: false}},
        files:[
          {expand:true, cwd:'packages/pages/', src:['*.jade'], dest:'../build/deploy/', ext:'.html', flatten:true}
        ]
      },
      docs: {
        options: {data: {debug: false}},
        files:[
          {expand:true, cwd:'packages/docs/', src:['html/*.jade'], dest:'../docs', ext:'.html', flatten:true}
        ]
      }
    },



    // watch file changes
    watch: {
      base: {
        files: ['packages/base/**/*.*'],
        tasks: ['base']
      },
      css: {
        files: ['packages/modules/**/style/*.scss'],
        tasks: ['css']
      },
      docs: {
        files: ['packages/docs/**/*.*'],
        tasks: ['docs']
      },
      html: {
        files: ['packages/base/html/*.jade','packages/modules/**/demo/*.jade','packages/modules/**/html/*.jade','packages/modules/**/html/*.json'],
        tasks: ['html']
      },
      pages: {
        files: ['packages/pages/*.jade'],
        tasks: ['pages']
      },
      img: {
        files: ['packages/modules/**/img/*.*'],
        tasks: ['assets']
      }//,
      // js:{
      //   files: ['packages/modules/**/js/*.js'],
      //   tasks: ['js']
      // }
    }
  });




  // Load the plugins
  // ===================================
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-jade');
  // grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-yui-compressor');




  // Default task(s)
  // ===================================
  grunt.registerTask('default', ['build']);

  // build all modules/pages, or individual modules/pages
  // default -> debug/
  grunt.registerTask('build', function(module) {
    // var module = module ? ":"+ module : "";
    var mode = grunt.option('deploy') ? 'deploy' : 'debug';

    grunt.task.run([
      'clean:'+mode,
      'compass:'+mode+'_base',
      'compass:'+mode+'_modules',
      'copy:'+mode+'_base',
      'copy:'+mode+'_modules',
      'jade:'+mode+'_pages',
      'jade:'+mode+'_modules',
      'docs'
    ]);
  });

  grunt.registerTask('debug', function() {
    grunt.option('deploy', false);
    grunt.run.task('build');
  });

  grunt.registerTask('deploy', function() {
    grunt.option('deploy', true);
    grunt.run.task('build');
  })

  // compile stuff in 'base'
  grunt.registerTask('base', 'copy files, compile CSS and JS', function() {
    var mode = grunt.option('deploy') ? 'deploy' : 'debug';

    grunt.task.run([
      'compass:'+mode+'_base',
      'copy:'+mode+'_base'
    ]);
  });

  // compile stuff in 'docs'
  grunt.registerTask('docs', 'update docs/ folder', function() {
    grunt.task.run([
      'compass:docs',
      'copy:docs',
      'jade:docs'
    ]);
  });


  // ----------------------------
  // can be module specfic, ex. grunt html:article-view

  // compile SCSS changes
  grunt.registerTask('css', function(module) {
    module = module || '**';
    var mode = grunt.option('deploy') ? 'deploy' : 'debug';

    // go through every module, or the one passed
    grunt.file.expand('packages/modules/'+module+'/style').forEach(function(path) {
      grunt.registerTask(path, function() {
        // set the sassDir for each module
        grunt.config('compass.'+mode+'_modules.options.sassDir', path);
        grunt.task.run('compass:'+mode+'_modules');
      });

      // run it
      grunt.task.run(path);
    });
  });

  // compile JADE files in modules
  grunt.registerTask('html', function(module) {
    module = module || '**';
    var mode = grunt.option('deploy') ? 'deploy' : 'debug';
    var array = [];

    grunt.file.expand('packages/modules/'+module+'/demo').forEach(function(path) {
      array.push({expand:true, cwd:path, src:['*.jade'], dest:'../build/'+ mode, ext:'.html', flatten:true});
    });

    grunt.config('jade.'+mode+'_modules.files', array);
    grunt.task.run('jade:'+mode+'_modules');
  });

  // compile JADE files in pages/
  grunt.registerTask('pages', function() {
    var mode = grunt.option('deploy') ? 'deploy' : 'debug';

    grunt.task.run([
      'jade:'+mode+'_pages'
    ]);
  });

  // copy assets from modules
  grunt.registerTask('assets', 'copy assets from modules', function(module) {
    module = module || '**';
    var mode = grunt.option('deploy') ? 'deploy' : 'debug';

    // grunt.file.expand('packages/modules/'+module+'/folderName').forEach(function(path) {
    //   grunt.registerTask(path, function() {

    //   })
    // });
    grunt.task.run('copy:'+mode+'_modules');
  });


  // ----------------------------
  // watch a specfic module

  grunt.registerTask('w', function(module) {
    module = module || '**';

        // check html
    var watch_html = ['packages/modules/'+module+'/html/*.jade', 'packages/modules/'+module+'/html/*.json'],
        // check js
        watch_js = ['packages/modules/'+module+'/js/*.js'],
        // check style
        watch_style = ['packages/modules/'+module+'/style/*.scss'],
        // check imgs
        watch_imgs = ['packages/modules/'+module+'/img/*.*'];

    var html_task = ['html:'+module],
        js_task = ['js:'+module],
        style_task = ['css:'+module],
        img_task = ['assets:'+module];

    // unfinished
  });
};
