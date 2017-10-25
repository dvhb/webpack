'use strict';

const config = require('../../scripts/config');
const gulp = require('gulp');
const gzip = require('gulp-gzip');

gulp.task('gzip', function () {
  return gulp.src(config.distDir + '/' + config.gzip.src)
    .pipe(gzip(config.gzip.options))
    .pipe(gulp.dest(config.distDir));
});
