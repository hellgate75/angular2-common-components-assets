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
  stylesPath       : './src/styles'
  ,scriptsPath     : './src/scripts'
  ,externScriptsPath     : './src/scripts'
  ,imagesPath      : './src/asset'
  // ,templatePath    : './src/templates'
  ,vendorPath      : './src/vendor'
  ,buildPath       : './dist'
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
 * COMPILE SCRIPTS
 */
gulp.task('extern-js', function() {
  return gulp.src(config.externScriptsPath  + '/*.js')
    .pipe($.concat('extern-scripts.js'))
    .pipe($.uglify())
    .pipe(gulp.dest(config.buildPath + '/extern'))
    .pipe($.size({title: 'Extern Scripts'}));
});

gulp.task('extern-css', function() {
  return gulp.src(config.externScriptsPath  + '/*.css')
    .pipe($.concat('extern-css.js'))
    .pipe($.cssmin())
    .pipe(gulp.dest(config.buildPath + '/extern'))
    .pipe($.size({title: 'Extern Css'}));
});

gulp.task('extern-themes', function() {
  return gulp.src(config.externScriptsPath  + '/themes')
    .pipe(gulp.dest(config.buildPath + '/extern/themes'))
    .pipe($.size({title: 'Extern Themes'}));
});

gulp.task('extern-images', function() {
  return gulp.src(config.externScriptsPath  + '/images/*.*')
    .pipe(
      $.imagemin({
        optimizationLevel: 5,
        progressive: true,
        interlaced: true
      })
    )
    .pipe(gulp.dest(config.buildPath + '/extern/images'))
    .pipe($.size({title: 'Extern Images'}));
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
  ]) 
    .pipe(gulp.dest(config.buildPath + '/vendor/fonts'))
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
    ,'extern-js'
    ,'extern-css'
    ,'extern-themes'
    ,'extern-images'
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
