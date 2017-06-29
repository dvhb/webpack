'use strict';

const requireDir = require('require-dir');
const gulp = require('gulp');

requireDir('./tasks');

gulp.task('default', function (cb) {
    return cb()
});
