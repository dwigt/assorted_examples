
'use strict';

/**
 * Import tasks
 **/
var del = require('del');
var Q = require('q');
var pack = require('./package.json'); //link to file
var config = require('./gulpconfig.js'); //link to file

var gulp = require('gulp');
var runSequence = require('run-sequence').use(gulp);
var chmod = require('gulp-chmod');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var gutil = require('gulp-util');
var notify = require('gulp-notify');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var inject = require('gulp-inject');
var sass = require('gulp-sass');
var sassGlob = require('gulp-sass-glob');
var rename = require('gulp-rename');
var consolidate = require('gulp-consolidate');
var path = require('path');
var size = require('gulp-size');
var fileinclude = require('gulp-file-include');// Frontend
var staticHash = require('gulp-static-hash');

//ES6 specific
var watchify = require('watchify');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var babelify = require("babelify");

/**
 * Environment
 **/
var isProduction = !!gutil.env.production;
var isBuildServer = !!gutil.env.buildserver;
var isDev = !isBuildServer && !isProduction;
var isWatching = false;
process.env.NODE_ENV = (isProduction) ? 'production' : '';

if(isDev){
    var imagemin = require('gulp-imagemin');// Frontend
    var iconfont = require('gulp-iconfont'); // Frontend
    var browserSync = require('browser-sync'); // Frontend
    var svgstore = require('gulp-svgstore');
    var svgmin = require('gulp-svgmin');
}

/**
 * Import Settings
 **/

var frontendSettings  = config.frontendSettings;
var javascriptConf = config.javascriptConf;
var cssConf = config.cssConf;

/**
 * Build type default
 */
 var injectAddRootSlash = frontendSettings.injectAddRootSlash;
 var injectIgnorePath = frontendSettings.injectIgnorePath;



var SASS_OPTIONS = {
    precision: 6,
    outputStyle: isProduction ? 'compressed' : 'expanded',
    errLogToConsole: true
};

function swallowError(err, $this, str) {
    console.log(err.toString());
    if (str) {
        console.log(str);
    }
    if (isBuildServer) {
        return;
    }
    $this.emit('end');
}

gulp.task('clean-js', function (cb) {
    del([
        javascriptConf.distFolder + '*.js',
        javascriptConf.distFolder + '**/*.js.map'
    ], cb);
});



gulp.task('clean-style', function (cb) {
    del([
        cssConf.distFolder + '*.css',
        cssConf.distFolder + '**/*.css.map'
    ], cb);
});



var injectTaskName = '';
var scriptTaskName = 'clean-js';
var styleTaskName = 'clean-style';

var scriptTaskNameArray = [];
var es6BundlesTasksArray = [];
var styleTaskNameArray = [];

function scriptTaskFunction(bundle){
  return gulp.src(bundle.files)
      .pipe(sourcemaps.init())
      .pipe(concat(bundle.name + '.js'))
      .pipe(isProduction ? uglify() : gutil.noop())
     // .pipe(isProduction && !bundle.noHash ? hash({ "format": bundle.name + "-{hash}{ext}" }) : gutil.noop())
      .pipe(sourcemaps.write('./maps'))
      .pipe(chmod(666))
      .pipe(gulp.dest(bundle.dist));
}

function es6bundleTaskFunction(bundle){

      function bundler(b, name, dest) {
        return b.bundle()
        .on("error", function(err) {
           gutil.log(gutil.colors.red("Browserify compile error:"), "\n\t", gutil.colors.cyan(err.message));})
          .pipe(source(name+'.js'))
          .pipe(buffer())
          .pipe(sourcemaps.init({loadMaps: true})) // loads map from browserify file
          .pipe(isProduction ? uglify() : gutil.noop())
         // .pipe(isProduction && !bundle.noHash ? hash({ "format": bundle.name + "-{hash}{ext}" }) : gutil.noop())
          .pipe(sourcemaps.write('./maps')) // writes .map file
          .pipe(gulp.dest(bundle.dist));
      }
      // add custom browserify options here
      var options = {
           paths: bundle.paths || ['./node_modules', './'],
           entries: bundle.files,
           debug: false,
           cache: {},
           packageCache: {},
       };
       console.log("isWatching: "+isWatching);

       if(isWatching){
         var opts = Object.assign({}, watchify.args, options);
         var b = watchify(browserify(opts));
         b.on('update', function(){
             console.log("isWatching: "+isWatching);
             bundler(b, bundle.name, bundle.dist)
         }); // on any dep update, runs the bundler
         b.on('log', gutil.log); // output build logs to terminal
       }else {
         var b = browserify(options);
       }
       
      b.transform(
          babelify.configure( {
            compact: false, 
            presets: (bundle.presets) ? bundle.presets : ["es2015"], 
            plugins: bundle.transformplugins || [] 
         })
        );
      return bundler(b, bundle.name, bundle.dist)
}

function styleTaskFunction(bundle){
      return gulp.src(bundle.files)
          .pipe(!isProduction ? sourcemaps.init() : gutil.noop())
          .pipe(sassGlob())
          .pipe(sass(SASS_OPTIONS)).on('error', function (e) {
              swallowError(e, this);
          })
          .pipe(autoprefixer({ browsers: frontendSettings.autoprefixer }))
          .pipe(!isProduction ? sourcemaps.write() : gutil.noop())
          // Load existing internal sourcemap, needed bcos of autoprefixer
          .pipe(!isProduction ? sourcemaps.init({loadMaps: true}) : gutil.noop())
         // .pipe(isProduction && !bundle.noHash ? hash({ "format": bundle.name + "-{hash}{ext}" }) : rename(bundle.name + ".css"))
          .pipe(rename(bundle.name + ".css"))
          .pipe(!isProduction ? sourcemaps.write('./maps') : gutil.noop())
          .pipe(gulp.dest(bundle.dist));
}

function injectTaskFunction(bundle, targetPath, sourceFileSearch){
  var source = gulp.src([sourceFileSearch], { read: false});
  return gulp.src(targetPath,  {base: "./" })
      .pipe(inject(source, {
          name: bundle.name,
          addRootSlash: injectAddRootSlash,
          ignorePath: injectIgnorePath,
          relative: frontendSettings.injectToDistPath
      }))
      .pipe(chmod(666))
      .pipe(isProduction ? staticHash() : gutil.noop())
      .pipe(gulp.dest('./'))
      .on('error', function (e) {
          swallowError(e, this, "View is read only, unlock it to update!");
      });
}

function setup() {
    var i;
    function scriptTask(lastName, bundle) {
        var dependencies = [];
        // if (lastName.length > 0) {
        //     dependencies = [lastName];
        // }
        if(!bundle.es6bundle){
        scriptTaskNameArray.push(bundle.name);
        gulp.task(bundle.name, dependencies, function () {
            return scriptTaskFunction(bundle)
        });
        }else{
            //es6 bundle
          es6BundlesTasksArray.push(bundle.name);
          gulp.task(bundle.name, dependencies, function () {
              return es6bundleTaskFunction(bundle)
          });
        }
    }
    function styleTask(lastName, bundle) {
        var dependencies = [];
        // if (lastName.length > 0) {
        //     dependencies = [lastName];
        // }
        styleTaskNameArray.push(bundle.name)
        gulp.task(bundle.name, dependencies, function () {
            return styleTaskFunction(bundle)
        });
    }
    function injectTask(lastName, taskName, sourceFileSearch, targetPath, bundle) {
        var dependencies = [];
        if (lastName.length > 0) {
            dependencies = [lastName];
        }
        gulp.task(taskName, dependencies, function () {
            return injectTaskFunction(bundle, targetPath, sourceFileSearch)
        });
    }

    var name, j, target, sourceFiles, bundle;
    for (i = 0; i < javascriptConf.bundles.length; i++) {
        bundle = javascriptConf.bundles[i];
        scriptTask(scriptTaskName, bundle);
        scriptTaskName = bundle.name;

        if (!bundle.targets) {
            continue;
        }
      //  for (j = 0; j < bundle.targets.length; j++) {
            target = bundle.targets;
            name = "inject-"+bundle.name;
            sourceFiles = javascriptConf.distFolder + bundle.name + '*.js';

            injectTask(injectTaskName, name, sourceFiles, target, bundle);
            injectTaskName = name;
      //  }
    }
    for (i = 0; i < cssConf.bundles.length; i++) {
        bundle = cssConf.bundles[i];
        styleTask(styleTaskName, bundle);
        styleTaskName = bundle.name;

        if (!bundle.targets) {
            continue;
        }

      //  for (j = 0; j < bundle.targets.length; j++) {
            target = bundle.targets;
            name = "inject-"+bundle.name;
            sourceFiles = cssConf.distFolder + bundle.name + '*.css';

            injectTask(injectTaskName, name, sourceFiles, target, bundle);
            injectTaskName = name;
      //  }
    }
}
setup();

gulp.task('clean-assets', function (cb) {
    del(frontendSettings.assetsDist, cb);
});

gulp.task('assets', ['clean-assets'], function(){
    gulp.src(frontendSettings.assetsSrc+'/**/*')
        .pipe(gulp.dest(frontendSettings.assetsDist));
});


// Build - running all tasks in order
gulp.task('build', ['assets'], function (cb) {
    runSequence(
        'clean-js',
        'clean-style',
        scriptTaskNameArray,
        es6BundlesTasksArray,
        styleTaskNameArray,
        injectTaskName,
        cb);
});


// Watch
gulp.task('watch', function () {
    isWatching = true;
    gulp.watch('src/sass/**/*.scss', [styleTaskNameArray]);
    gulp.watch("src/js/**/*.js", [scriptTaskNameArray]);
    runSequence('build')
});



// Default
if (isBuildServer) {
    gulp.task('default', ['build']);
} else {
    gulp.task('default', ['watch']);
}



//--------------------------------------------------------------------------------
//FRONTEND TASKS
//--------------------------------------------------------------------------------

gulp.task('dev', ['serve', 'dev-watch']);

// Watch
gulp.task('dev-watch', function () {
    isWatching = true;
    gulp.watch('src/**/*.scss', [styleTaskNameArray]);
    gulp.watch("src/**/*.js", [scriptTaskNameArray]);
    gulp.watch('src/**/*.html', ['styleguide-html','html']);
    runSequence('dev-build');
});

//frontend dev build
gulp.task('dev-build', function (cb) {
    if(frontendSettings.injectToDistPath){
        injectAddRootSlash = false;
        injectIgnorePath = 'dist';
    }
    runSequence('file-include', 'styleguide-html', 'build', cb);
});

// Copy and flatten html filse to dist folder
gulp.task('html', function (cb) {
    runSequence('file-include', injectTaskName, cb)

});
gulp.task('file-include', function(){
    return gulp.src([frontendSettings.src+'/*.html'])
        .pipe(fileinclude({
            prefix: '@@',
            basepath: 'src/'
        }))
        .on('error', function(e) {
            console.log(e);
        })
        .pipe(gulp.dest(frontendSettings.dist));
})

// Optimize Images
gulp.task('imagemin', function () {
    return gulp.src(frontendSettings.gfxDir+'/**/*')
        .pipe(size({ title: 'imagemin' }))
        .pipe(imagemin({ progressive: true, interlaced: true }))
        .pipe(chmod(666))
        .pipe(gulp.dest(frontendSettings.gfxDest))
        .pipe(size({ title: 'imagemin' }));
});


// Build iconfont from svg's and generate stylesheet
gulp.task('iconfont', function () {
    gulp.src([frontendSettings.iconFontSrcIcons+'/*.svg'])
        .pipe(iconfont({
            fontName: frontendSettings.iconFontName,
            normalize: true,
            fontHeight: 1024,
            descent: 64,
            ascent: 960
        }))
        .on('codepoints', function (codepoints, options) {
            gulp.src(frontendSettings.iconFontTemplate)
                .pipe(consolidate('lodash', {
                    glyphs: codepoints,
                    fontName: frontendSettings.iconFontName,
                    fontPath: frontendSettings.iconFontTemplatePaths,
                    className: 'icon'
                }))
                .on('error', gutil.log)
                .pipe(gulp.dest(frontendSettings.src+'/sass/base/'))
                .pipe(notify("Icon font updated!"));
        })
        .on('error', gutil.log)
        .pipe(gulp.dest(frontendSettings.iconFontDest));
});

//svg sprite
gulp.task('svg', function(){
    // Basic configuration example
    return gulp
        .src(frontendSettings.assetsSrc+'/assets/icons/**/*.svg')
        .pipe(svgmin(function (file) {
            var prefix = path.basename(file.relative, path.extname(file.relative));
            return {
                plugins: [{
                    cleanupIDs: {
                        prefix: prefix + '-',
                        minify: true
                    }
                }]
            }
        }))
        .pipe(svgstore())
        .pipe(gulp.dest(frontendSettings.assetsSrc+'/assets/svgsprite/'));

});


//Styleguide
gulp.task('clean-styleguide', function (cb) {
    del(frontendSettings.assetsDist+'/styleguide', cb);
});

gulp.task('styleguide-lib', ['clean-styleguide'], function(){
    return gulp.src(['src/styleguide/_core/**/*'])
        .pipe(gulp.dest(frontendSettings.assetsDist+"/styleguide/_core/"));
});
gulp.task('styleguide-html', function(){
    return gulp.src([frontendSettings.src+'/styleguide/*.html'])
        .pipe(fileinclude({
            prefix: '@@',
            basepath: 'src/'
        }))
        .on('error', function(e) {
            console.log(e);
        })
        .pipe(gulp.dest(frontendSettings.dist+"/styleguide"));
});


// Start browser sync server (hosting ./dist at localhost:3000 or your-ip:3000),
// then reload/inject when listed files changes.
gulp.task('serve', function () {
    browserSync.init(frontendSettings.browserSyncFiles, frontendSettings.browserSyncSettings);
});
