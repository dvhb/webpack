'use strict';

/* eslint-disable no-console */

const consts = require('./consts');
const DvhbWebpackError = require('./utils/error');
const minimist = require('minimist');
const argv = minimist(process.argv.slice(2));
const chalk = require('chalk');

const getConfig = require('./getConfig');

let config;
try {
  config = getConfig(argv);
}
catch (err) {
  if (err instanceof DvhbWebpackError) {
    console.error(chalk.bold.red(err.message));
    console.log();
    console.log('Learn how to configure your webpack config:');
    console.log(chalk.underline(consts.DOCS_CONFIG));
    process.exit(1);
  }
  else {
    throw err;
  }
}

module.exports = config;
