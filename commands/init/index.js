'use strict';

const Base = require('yeoman-generator').Base;
const install = require('./generator/install');
const writing = require('./generator/writing');
const prompting = require('./generator/prompting');

module.exports = Base.extend({
  prompting,
  writing,
  install
});
