const gulp = require('gulp');
const clean = require('gulp-clean');
const fs = require('fs');
const argv = require('yargs').argv;
const inclideHTMLFiles = require('gulp-file-include');
const webpHTML = require('gulp-webp-html')
const scss = require('gulp-sass')(require('sass'));
const scssGlob = require('gulp-sass-glob');
const scssMaps = require('gulp-sourcemaps');
const scssMedia = require('gulp-group-css-media-queries');
const webpCSS = require('gulp-webp-css')
const serverLive = require('gulp-server-livereload');
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const prettier = require('gulp-prettier');
const webpack = require('webpack-stream');
const babel = require('gulp-babel');
const imagemin = require('gulp-imagemin');
const imagewebp = require('gulp-webp');
const change = require('gulp-changed');

const includesHTMLSettings = {
  prefix: '@@',
  basepath: '@file',
};

const pathHTML = ['./src/**/*.html', '!./src/components/**/*.html', '!./src/base/**/*.html']
const pathSCSS = ['./src/*.scss', '!./src/base/**/*.scss']
const pathJS = ['./src/*.js', '!./src/base/**/*.js']

const plumberSettings = (title) => {
  return {
    errorHandler: notify.onError({
      title: title,
      message: 'Error <%= error.message %>',
      sound: false,
    }),
  };
}

gulp.task('clean:dev', function(done){
  if (fs.existsSync('./dev/')) {
    return gulp.src('./dev/', {read: false})
    .pipe(clean());
  }
  else {
    done()
  }
});

gulp.task('inclideHTML:dev', function(){
  return gulp.src(pathHTML)
    .pipe(change('./dev/', {hasChanged: change.compareContents}))
    .pipe(plumber(plumberSettings('HTML')))
    .pipe(inclideHTMLFiles(includesHTMLSettings))
    .pipe(webpHTML())
    .pipe(prettier())
    .pipe(gulp.dest('./dev/'));
});

gulp.task('scss:dev', function(){
  return gulp.src(pathSCSS)
    .pipe(change('./dev/css'))
    .pipe(plumber(plumberSettings('SCSS')))
    .pipe(scssMaps.init())
    .pipe(scssGlob())
    .pipe(webpCSS())
    .pipe(scssMedia())
    .pipe(scss())
    .pipe(scssMaps.write())
    .pipe(prettier())
    .pipe(gulp.dest('./dev/css'));
});

gulp.task('js:dev', function(){
  return gulp.src(pathJS)
    .pipe(change('./dev/js'))
    .pipe(plumber(plumberSettings('JS')))
    // .pipe(babel())
    .pipe(webpack(require('./../webpack.config.js')))
    .pipe(prettier())
    .pipe(gulp.dest('./dev/js'))
})

gulp.task('images:dev', function(){
  return gulp.src('./src/img/**/*')
    .pipe(change('./dev/img/'))
    .pipe(imagewebp())
    .pipe(gulp.dest('./dev/img/'))
    .pipe(gulp.src('./src/img/**/*'))
    .pipe(change('./dev/img/'))
    .pipe(imagemin({verbose: true}))
    .pipe(gulp.dest('./dev/img/'))
});

gulp.task('fonts:dev', function(){
  return gulp.src('./src/fonts/**/*')
    .pipe(change('./dev/fonts/'))
    .pipe(gulp.dest('./dev/fonts/'))
});

gulp.task('favicon:dev', function(){
  return gulp.src('./src/favicon/**/*')
    .pipe(change('./dev/favicon/'))
    .pipe(gulp.dest('./dev/favicon/'))
});

gulp.task('create-components', function(done) {
  const name = argv.name;
  if (typeof name !== 'string') {
    console.error('Please provide a name using --name flag');
    done(new Error('Name not provided'));
    return;
  }

  const folderPath = `./src/components/${name}`;

  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath);
  }
  
  fs.writeFileSync(`./src/components/${name}/${name}.html`, '');
  fs.writeFileSync(`./src/components/${name}/_${name}.scss`, '');
  fs.writeFileSync(`./src/components/${name}/index.js`, '');
  console.log(`Component ${name} created successfully`);
  
  done();
});

gulp.task('server:dev', function(){
  return gulp.src('./dev/')
    .pipe(serverLive({
      livereload: true,
      open: true,
    }))
});

gulp.task('watch:dev', function(){
  gulp.watch('./src/**/*.html', gulp.parallel('inclideHTML:dev'));
  gulp.watch('./src/**/*.scss', gulp.parallel('scss:dev'));
  gulp.watch('./src/**/*.js', gulp.parallel('js:dev'));
  gulp.watch('./src/fonts/**/*', gulp.parallel('fonts:dev'));
  gulp.watch('./src/img/**/*', gulp.parallel('images:dev'));
});