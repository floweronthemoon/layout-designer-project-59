// Надо создать задачи для работы Gulp
// План такой: 
// 1. Сначала pug переводится в html +
// 2. Sass переводится в css +
// 3. Активизируется svg-sprite
// 4. Активизируется concat +
// 5. Вотчер
// 6. Синхронизация с браузером

const { src, dest, parallel } = require('gulp');
const pug = require('gulp-pug');
const sass = require('gulp-sass')(require('sass'));
const svgSprite = require('gulp-svg-sprite');
var concat = require('gulp-concat');
const { watch } = require('gulp');
const browserSync = require('browser-sync').create();

const browserSyncJob = () => {
  browserSync.init({
    server: "build/"
  });
  watch('app/scss/*.scss', buildSass);
  watch('app/pug_files/*.pug', buildPug);
};

const buildSass = () => {
  console.log('Компиляция SASS');

  return src('app/scss/*.scss')
    .pipe(sass())
    .pipe(concat('build/styles/style.css'))
    .pipe(dest('build/styles/'))
    .pipe(browserSync.stream());
}

const buildPug = () => {
  console.log('Компиляция Pug');

  return src('app/pug_files/*.pug')
    .pipe(pug())
    .pipe(dest('build/html_files/'))
    .pipe(browserSync.stream());
}

exports.server = browserSyncJob;
exports.default = parallel(buildSass, buildPug);



