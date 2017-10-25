'use strict';

const requireDir = require('require-dir');
const gulp = require('gulp');
const config = require('../scripts/config');

requireDir('./tasks');

let tasks = [];

if (!config.staticSite) {
  tasks.unshift('templates')
}

tasks.push('gzip');

gulp.task('default', gulp.series(tasks), function (cb) {
  return cb()
});
