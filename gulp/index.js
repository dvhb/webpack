'use strict';

const gulpRunner = require('./gulp-runner');
const chalk = require('chalk');
const path = require('path');
const _ = require('lodash');

const minimist = require('minimist');
const argv = minimist(process.argv.slice(2));

module.exports = function gulp(config, env, callback) {

  const gulp = new gulpRunner(path.resolve(__dirname, 'gulpfile.js'));

  let opts = _.merge({}, argv);
  delete opts._;

  opts.env = env;
  opts.config = opts.config? `../${opts.config}` : null;

  gulp.on('start', function () {
    if (config.verbose) {
      console.log(chalk.yellow('gulp starting...'));
    }
  });

  gulp.on('complete', function () {
    if (config.verbose) {
      console.log(chalk.yellow('gulp complete!'));
    }

    callback();
  });

  gulp.on('log', function (data) {
    if (config.verbose) {
      process.stdout.write(data);
    }
  });

  // equivalent of calling
  // gulp tasks --env 'production' --config 'examples/static-site/dvhb.config.js'
  gulp.run('default', opts, (err) => {
    // complete!
  });
};
