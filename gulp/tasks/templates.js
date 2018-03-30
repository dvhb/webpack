'use strict';

const gulp = require('gulp');
const pug = require('gulp-pug');
const filter = require('gulp-filter');
const utils = require('../../scripts/utils/utils');
const config = require('../../scripts/config');

gulp.task('templates', function () {
  return gulp.src(config.viewsDir + '/**/*.pug')
    .pipe(excludeTemplates(config))
    .pipe(pug({
      locals: getTemplateLocals(config)
    }))
    .pipe(gulp.dest(config.distDir));
});

function excludeTemplates(config) {
  let f = [
    '**',
    '!**/partials/**',
    '!**/_partials/**',
  ];

  //exclude build templates in html folder (it's dev markup templates)
  if (config.appEnv != 'development') {
    f.push('!**/html/**')
  }

  return filter(f);
}

function getTemplateLocals(config) {
  const manifestDir = config.distDir + '/manifest.json';

  let locals = {
    publicPath: config.publicPath,
    templateVars: config.templateVars,
    env: config.env,
  };

  if (config.env === 'production') {
    if (utils.isFileExists(manifestDir)) {
      locals.manifest = require(manifestDir)
    }
  }

  return locals;
}
