'use strict';

const Base = require('yeoman-generator').Base;
const init = require('./generator/init');
const install = require('./generator/install');
const writing = require('./generator/writing');
const prompting = require('./generator/prompting');

module.exports = Base.extend({
    init,
    prompting,
    writing,
    install
});
