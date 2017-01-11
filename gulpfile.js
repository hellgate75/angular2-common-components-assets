/**
 * LOAD PLUGINS
 */
var gulp          = require('gulp')
  ,bower        = require('gulp-bower')
  ,merge        = require('merge-stream')
  ,del          = require('del')
  ,rs           = require('run-sequence')
  ,$            = require('gulp-load-plugins')();

var config = {
  stylesPath         : './src/styles'
  ,scriptsPath       : './src/scripts'
  ,externScriptsPath : './src/unbounded'
  ,bootstrapPath     : './node_modules/bootstrap-sass/assets'
  ,imagesPath      : './src/asset'
  // ,templatePath      : './src/templates'
  ,vendorPath        : './src/vendor'
  ,buildPath         : './dist'
}

/**
 * CLEAR CACHE
 */
gulp.task('clear', function(cb) {
  return del(
    [
      config.buildPath  + '/**/*'
      ,config.buildPath + '/.*'
    ]
    ,{force: true}
    ,cb
  );
});

/**
 * BOWER
 */
gulp.task('bower', function() {
  return bower(config.vendorPath)
    .pipe($.size({title: 'Bower'}))
});

/**
 * COMPILE STYLE
 */
gulp.task('styles', function() {
  return gulp.src([
    config.stylesPath +  '/main.scss'
    ,config.stylesPath + '/old.scss'
  ])
    .pipe($.sass({outputStyle:'nested'})
      .on('error', $.notify.onError(
        function (error) {
          return error.message;
        }
      ))
    )
    .pipe($.autoprefixer({
      browsers: [
        'last 2 version'
        ,'> 1%'
        ,'safari 5'
        ,'ie 8'
        ,'ie 9'
        ,'opera 12.1'
        ,'ios 6'
        ,'android 4'
      ]
      ,cascade: false
    }))
    .pipe(gulp.dest(config.buildPath + '/styles'))
    .pipe($.rename({suffix: '.min'}))
    .pipe($.cssmin())
    .pipe(gulp.dest(config.buildPath + '/styles'))
    .pipe($.size({title:'Styles'}));
});

/**
 * PRETTIFY THEME FILES
 */
// gulp.task('theme', function() {
//   return gulp.src(config.templatePath + '/**/*.html')
//     .pipe($.prettify({
//       indent_inner_html: true,
//       indent_size: 2
//     }))
//     .pipe(gulp.dest(config.buildPath))
//     .pipe($.size({title: 'Template'}));
// });


/**
 * COMPILE EXTERN SCRIPTS
 */
gulp.task('bootstrap-js', function() {
  return gulp.src(config.bootstrapPath  + '/javascript/bootstrap.js')
    .pipe($.concat('bootstrap.min.js'))
    .pipe($.uglify())
    .pipe(gulp.dest(config.buildPath + '/vendor/scripts'))
    .pipe($.size({title: 'Bootstrap Scripts'}));
});

gulp.task('unbounded-js', function() {
  return gulp.src(config.externScriptsPath  + '/**/*.js')
    .pipe($.concat('vendor-scripts.min.js'))
    .pipe($.uglify())
    .pipe(gulp.dest(config.buildPath + '/vendor/scripts'))
    .pipe($.size({title: 'Unbounded Vendor Scripts'}));
});

/**
 * COMPILE EXTERN CSS
 */
gulp.task('unbounded-css', function() {
  return gulp.src(config.externScriptsPath  + '/**/*.css')
    .pipe($.concat('vendor-styles.min.css'))
    .pipe($.cssmin())
    .pipe(gulp.dest(config.buildPath + '/vendor/styles'))
    .pipe($.size({title: 'Unbounded Vendor Css'}));
});

/**
 * COMPILE EXTERN THEMES
 */
gulp.task('unbounded-themes', function() {
  return gulp.src(config.externScriptsPath  + '/css/themes/**/*')
    .pipe(gulp.dest(config.buildPath + '/vendor/styles/themes'))
    .pipe($.size({title: 'Unbounded Vendor Themes'}));
});

/**
 * COMPRESS EXTERN IMAGES AND CACHE THEM
 */
gulp.task('unbounded-images', function() {
  return gulp.src(config.externScriptsPath  + '/css/images/*')
    .pipe(
      $.imagemin({
        optimizationLevel: 5,
        progressive: true,
        interlaced: true
      })
    )
    .pipe(gulp.dest(config.buildPath + '/vendor/styles/images'))
    .pipe($.size({title: 'Unbounded Vendor Images'}));
});


/**
 * COMPILE SCRIPTS
 */
gulp.task('scripts', function() {
  return gulp.src(config.scriptsPath  + '/scripts.js')
    .pipe($.concat('scripts.js'))
    .pipe($.uglify())
    .pipe(gulp.dest(config.buildPath + '/scripts'))
    .pipe($.size({title: 'Scripts'}));
});
/**
 * COMPRESS IMAGES AND CACHE THEM
 */
gulp.task('images', function() {
  return gulp.src(config.imagesPath + '/**/*')
    .pipe(
      $.imagemin({
        optimizationLevel: 5,
        progressive: true,
        interlaced: true
      })
    )
    .pipe(gulp.dest(config.buildPath + '/images'))
    .pipe($.size({title: 'Images'}));
});

/**
 * COMPILE VENDOR FILES
 */
gulp.task('vendor', function() {

  /**
   * COMPILE FONTS VENDOR FILES
   */
  var fonts = gulp.src([
    config.vendorPath  + '/font-awesome/fonts/**.*'
    ,config.vendorPath + '/open-sans/fonts/**/**.*'
    ,config.bootstrapPath + '/fonts/**/**.*'
  ])
    .pipe(gulp.dest(config.buildPath + '/fonts'))
    .pipe($.size({title: 'Vendor: Fonts'}));

  /**
   * COMPILE JS VENDOR FILES
   */
  var js = gulp.src([
    config.vendorPath  + '/jquery/dist/jquery.js'
    ,config.vendorPath + '/html5shiv/dist/html5shiv.js'
  ])
    .pipe($.uglify())
    .pipe(gulp.dest(config.buildPath + '/vendor/scripts'))
    .pipe($.size({title: 'Vendor: JS'}));

  return merge(fonts, js);
});

/**
 * WATCHING FOR CHANGES
 */
gulp.task('watch', function() {
  // gulp.watch(config.templatePath + '/**/*', ['theme']);
  gulp.watch(config.stylesPath   + '/**/*', ['styles']);
  gulp.watch(config.scriptsPath  + '/**/*', ['scripts']);
  gulp.watch(config.externScriptsPath  + '/**/*', ['unbounded']);
  gulp.watch(config.imagesPath   + '/**/*', ['images']);
});

/**
 * BUILD TASK
 */
gulp.task('build', function(cb) {
  rs(
    'clear'
    ,'bower'
    ,'vendor'
    ,'scripts'
    ,'styles'
    // ,'theme'
    ,'images'
    ,'bootstrap-js'
    ,'unbounded-js'
    ,'unbounded-css'
    ,'unbounded-themes'
    ,'unbounded-images'
    ,cb
  );
});

/**
 * DEFAULT TASK
 */
gulp.task('default', function(cb) {
  rs(
    'build'
    ,'watch'
    ,cb
  );
});
