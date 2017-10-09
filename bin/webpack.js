#!/usr/bin/env node

'use strict';

/* eslint-disable no-console */

const minimist = require('minimist');
const chalk = require('chalk');
const getConfig = require('../scripts/config');
const consts = require('../scripts/consts');
const DvhbWebpackError = require('../scripts/utils/error');
const argv = minimist(process.argv.slice(2));
const utils = require('../scripts/utils/utils');

const yeoman = require('yeoman-environment');
const path = require('path');

//project logo
console.log(utils.getProjectLogo());

switch (argv._[0]) {
  case 'build':
    commandBuild();
    break;
  case 'server':
    commandServer();
    break;
  case 'init':
    commandInit();
    break;
  default:
    commandHelp();
}

function commandBuild() {
  let config = loadConfig(argv);
  console.log('Building project...');

  const build = require('../scripts/build');
  build(config, err => {
    if (err) {
      console.log(err);
      process.exit(1);
    }
    else {
      console.log('Project published to:');
      console.log(chalk.underline(config.distDir));
    }
  });
}

function commandServer() {
  let config = loadConfig(argv);

  process.on('uncaughtException', err => {
    if (err.code === 'EADDRINUSE') {
      console.error(chalk.bold.red(
        `You have another server running at port ${config.serverPort} somewhere, shut it down first`
      ));
      console.log();
      console.log('You can change the port using the `serverPort` option in your dvhb.config.js:');
      console.log(chalk.underline(consts.DOCS_CONFIG));
    }
    else {
      console.error(chalk.bold.red(err.message));
    }
    process.exit(1);
  });

  const server = require('../scripts/server');
  server(config, err => {
    if (err) {
      console.log(err);
    }
    else {
      console.log(`Server started at ${chalk.bold(config.env)} mode:`);
      console.log('Local:          ', chalk.underline('http://' + config.serverHost + ':' + config.serverPort));

      if (config.serverHostNetwork && config.env == 'development') {
        console.log('On Your Network:', chalk.underline('http://' + config.serverHostNetwork + ':' + config.serverPort));
      }
      console.log();
    }
  });
}

function commandInit() {
  const env = yeoman.createEnv();
  const dir = path.resolve(__dirname, `../commands/init`);
  const done = (exitCode) => process.exit(exitCode || 0);

  env.register(require.resolve(dir), `dvhb:init`);
  env.run(`dvhb:init`, done);
}

function loadConfig(options) {
  let config;
  try {
    config = getConfig(options);
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

  return config;
}

function commandHelp() {
  console.log([
    chalk.underline('Usage'),
    '',
    '    ' + chalk.bold('dvhb-webpack') + ' ' + chalk.cyan('<command>') + ' ' + chalk.yellow('[<options>]'),
    '',
    chalk.underline('Commands'),
    '',
    '    ' + chalk.cyan('build') + '           Build style guide',
    '    ' + chalk.cyan('server') + '          Run development server',
    '    ' + chalk.cyan('help') + '            Display help',
    '',
    chalk.underline('Options'),
    '',
    '    ' + chalk.yellow('--config') + '        Config file path',
    '    ' + chalk.yellow('--verbose') + '       Print debug information',
    '    ' + chalk.yellow('--port') + '          Server port',
    '    ' + chalk.yellow('--env') + '           Environment',
  ].join('\n'));
}
