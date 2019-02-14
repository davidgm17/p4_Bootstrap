//  =========================================================
//                        gulpfile.js
//  =========================================================

//  -------------------------------------------- strict mode

'use strict';

//  ----------------------------------------------- requires

const fs = require('fs');
const gulp = require('gulp');
const sass = require('gulp-sass');
const babel = require('gulp-babel');
const gulpif = require('gulp-if');
const clean = require('gulp-clean');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify-es').default;
const htmlmin = require('gulp-htmlmin');
const replace = require('gulp-batch-replace');
const sourcemaps = require('gulp-sourcemaps');
const browserSync = require('browser-sync').create();
const autoprefixer = require('gulp-autoprefixer');
const imagemin = require('gulp-imagemin');
// ---------------------------------------------- Gulp CONF Reload

const CF = './gulpconf.js';

let CONF = require(CF);

gulp.task('CONFReload', (done) => {
  console.log('\x1b[33m%s\x1b[0m', '========================================================');
  console.log('\x1b[33m%s\x1b[0m', '==       You should reload gulp to apply changes      ==');
  console.log('\x1b[33m%s\x1b[0m', '==  Deberías recargar gulp para aplicar los cambios   ==');
  console.log('\x1b[33m%s\x1b[0m', '========================================================');
  done();
});

sass.compiler = require('node-sass');

// ---------------------------------------------- Gulp Tasks

gulp.task('serve', () => {
  browserSync.init(CONF.browser.opts);
});

gulp.task('html', () => {
  return gulp.src(CONF.html.src)
    .pipe(replace(CONF.html.replace_args_global))
    .pipe(gulpif(CONF.global.minify_style, replace(CONF.html.replace_args_style_min), replace(CONF.html.replace_args_style)))
    .pipe(gulpif(CONF.global.minify_scripts, replace(CONF.html.replace_args_scripts_min)))
    .pipe(gulpif(CONF.global.minify_html, htmlmin(CONF.html.opts.minify)))
    .pipe(gulp.dest(CONF.html.dest));
});

gulp.task('favicon', () => {
  return gulp.src(CONF.images.favicon)
    .pipe(gulp.dest(CONF.html.dest));
});

gulp.task('img', () => {
  return gulp.src(CONF.images.src)
    .pipe(gulpif(CONF.global.minify_img, imagemin()))
    .pipe(gulp.dest(CONF.images.dest));
});

gulp.task('sass', () => {
  return gulp.src(['node_modules/bootstrap/scss/bootstrap.scss', CONF.sass.src])
    .pipe(sourcemaps.init())
    .pipe(sass.sync(gulpif(CONF.global.minify_style, CONF.sass.opts.minify, CONF.sass.opts.normal)).on('error', sass.logError))
    .pipe(gulpif(CONF.global.sass_autoprefix, autoprefixer(CONF.sass.autoprefix_opts)))
    .pipe(gulpif(CONF.global.minify_style, rename(CONF.sass.opts.rename)))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(CONF.sass.dest))
    .pipe(browserSync.stream());
});

gulp.task('javascript', () => {
  return gulp.src([
    "node_modules/jquery/dist/jquery.min.js",
    // "node_modules/popper.js/dist/popper.js",
    "node_modules/bootstrap/dist/js/bootstrap.bundle.min.js",
    CONF.javascript.src
    ])
    .pipe(babel(CONF.javascript.opts.env))
    .pipe(gulpif(CONF.global.minify_scripts, rename(CONF.javascript.opts.rename)))
    .pipe(gulpif(CONF.global.minify_scripts, uglify()))
    .pipe(gulp.dest(CONF.javascript.dest));
});

// ---------------------------------------------- Gulp Watch
gulp.task('watch:styles', () => {
  gulp.watch(CONF.sass.src, gulp.series(
    'sass'
  ));
  browserSync.stream();
});

gulp.task('watch:scripts', () => {
  gulp.watch(CONF.javascript.src, gulp.series(
    'javascript'
  )).on('change', browserSync.reload);
});

gulp.task('watch:index', () => {
  gulp.watch(CONF.html.src, gulp.series(
    'html'
  )).on('change', browserSync.reload);
});

gulp.task('watch:CONF', () => {
  gulp.watch(CF).on('change', gulp.series('CONFReload'));
});

gulp.task('watch', gulp.parallel('watch:index', 'watch:styles', 'watch:scripts', 'watch:CONF'));

gulp.task('start', gulp.parallel('html', 'favicon', 'sass', 'javascript'));

gulp.task('clean', (done) => {
  if (fs.existsSync(CONF.html.dest)) {
    gulp.src(CONF.html.dest, { read: false })
      .pipe(clean());
  }
  done()
});

gulp.task('build', gulp.series('clean', 'start', 'img'));

// -------------------------------------------- Default task

gulp.task('default', gulp.series('start', gulp.parallel('watch', 'serve')));