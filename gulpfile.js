// Надо создать задачи для работы Gulp
// План такой: 
// 1. Сначала pug переводится в html +
// 2. Sass переводится в css +
// 3. Активизируется svg-sprite
// 4. Активизируется concat +
// 5. Вотчер
// 6. Синхронизация с браузером

const { gulp, src, dest, series } = require('gulp');
const pug = require('gulp-pug');
const sass = require('gulp-sass')(require('sass'));
const svgSprite = require('gulp-svg-sprite');
var concat = require('gulp-concat');
const { watch } = require('gulp');
const browserSync = require('browser-sync').create();

const copyFile = () => {
  return src('app/**')
    .pipe(dest('build/app'))
};

const buildSprite = () => {
  return src('./app/images/icons/*.svg')
    .pipe(svgSprite({
      mode: {
        stack: {
          sprite: "../sprite.svg"
        }
      },
      shape: {
        id: {
          separator: '--'
        }
      },
      svg: {
        namespaceIDs: true
      },
    }
    ))
    .pipe(dest('build/app/images/iconsprite'))
    .pipe(browserSync.stream());
};

const buildSass = () => {
  console.log('Компиляция SASS');

  return src('build/app/scss/app.scss')
    .pipe(sass())
    .pipe(concat('style.css'))
    .pipe(dest('build/'))
    .pipe(browserSync.stream());
};

const buildPug = () => {
  console.log('Компиляция Pug');

  return src('build/app/pug_files/*.pug')
    .pipe(pug({
      pretty: false
    })
    )
    .pipe(dest('build/'))
    .pipe(browserSync.stream());
};

const watchers = () => {
  browserSync.init({
    server: "build/"
  })
  watch('build/').on('change', browserSync.reload)
  watch('build/app/scss/*.scss').on('change', buildSass)
  watch('build/app/pug_files/*.pug').on('change', buildPug)
};

const browserSyncJob = () => {
  browserSync.init({
    server: "build/"
  })
  // watch('app/scss/*.scss').on('change', browserSync.reload)
  // watch('app/pug_files/*.pug').on('change', browserSync.reload)
  watch('build/').on('change', browserSync.reload)
};

exports.copy = copyFile;
exports.server = browserSyncJob;
exports.default = series(copyFile, buildSprite, buildSass, buildPug, watchers, browserSyncJob);
exports.watchers = watchers;



