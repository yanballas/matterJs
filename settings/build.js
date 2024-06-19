const gulp = require('gulp');
const clean = require('gulp-clean');
const fs = require('fs');
const inclideHTMLFiles = require('gulp-file-include');
const webpHTML = require('gulp-webp-html')
const minifyHTML = require('gulp-htmlclean');
const scss = require('gulp-sass')(require('sass'));
const scssGlob = require('gulp-sass-glob');
const scssMaps = require('gulp-sourcemaps');
const scssMedia = require('gulp-group-css-media-queries');
const scssPrefixer = require('gulp-autoprefixer');
const webpCSS = require('gulp-webp-css')
const minifyCSS = require('gulp-csso');
const serverLive = require('gulp-server-livereload');
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const webpack = require('webpack-stream');
const babel = require('gulp-babel');
const minifyJS = require('gulp-uglify');
const imagemin = require('gulp-imagemin');
const imagewebp = require('gulp-webp');
const change = require('gulp-changed');
const zipBuild = require('gulp-zip');

const includesHTMLSettings = {
  prefix: '@@',
  basepath: '@file',
};

const pathHTML = ['./src/**/*.html', '!./src/components/**/*.html']

const pathZip = ['./build/**', '!./build/build.zip'];

const plumberSettings = (title) => {
  return {
    errorHandler: notify.onError({
      title: title,
      message: 'Error <%= error.message %>',
      sound: false,
    }),
  };
}

gulp.task('clean:build', function(done){
  if (fs.existsSync('./build/')) {
    return gulp.src('./build/', {read: false})
    .pipe(clean());
  }
  else {
    done()
  }
});

gulp.task('inclideHTML:build', function(){
  return gulp.src(pathHTML)
    .pipe(change('./build/'))
    .pipe(plumber(plumberSettings('HTML')))
    .pipe(inclideHTMLFiles(includesHTMLSettings))
    .pipe(webpHTML())
    .pipe(minifyHTML())
    .pipe(gulp.dest('./build/'));
});

gulp.task('scss:build', function(){
  return gulp.src('./src/*.scss')
    .pipe(change('./build/css'))
    .pipe(plumber(plumberSettings('SCSS')))
    .pipe(scssMaps.init())
    .pipe(scssPrefixer())
    .pipe(scssGlob())
    .pipe(webpCSS())
    .pipe(scssMedia())
    .pipe(scss())
    .pipe(minifyCSS())
    .pipe(scssMaps.write())
    .pipe(gulp.dest('./build/css'));
});

gulp.task('js:build', function(){
  return gulp.src('./src/*.js')
    .pipe(change('./build/js'))
    .pipe(plumber(plumberSettings('JS')))
    .pipe(babel())
    .pipe(webpack(require('./../webpack.config.js')))
    .pipe(minifyJS())
    .pipe(gulp.dest('./build/js'))
})

gulp.task('images:build', function(){
  return gulp.src('./src/img/**/*')
    .pipe(change('./build/img/'))
    .pipe(imagewebp())
    .pipe(gulp.dest('./build/img/'))
    .pipe(gulp.src('./src/img/**/*'))
    .pipe(change('./build/img/'))
    .pipe(imagemin({verbose: true}))
    .pipe(gulp.dest('./build/img/'))
});

gulp.task('fonts:build', function(){
  return gulp.src('./src/fonts/**/*')
    .pipe(change('./build/fonts/'))
    .pipe(gulp.dest('./build/fonts/'))
});

gulp.task('favicon:build', function(){
  return gulp.src('./src/favicon/**/*')
    .pipe(change('./build/favicon/'))
    .pipe(gulp.dest('./build/favicon/'))
});

gulp.task('server:build', function(){
  return gulp.src('./build/')
    .pipe(serverLive({
      livereload: true,
      open: true,
    }))
});

gulp.task('zip:build', function() {
  return gulp.src(pathZip)
    .pipe(zipBuild('build.zip'))
    .pipe(gulp.dest('./build/'));
});