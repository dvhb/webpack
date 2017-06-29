'use strict';

const gulpRunner = require('./gulp-runner');
const chalk = require('chalk');
const path = require('path');

const minimist = require('minimist');
const argv = minimist(process.argv.slice(2));

module.exports = function gulp(config, env, callback) {

    const gulp = new gulpRunner(path.resolve(__dirname, 'tasks'));

    const opts = {
        require: 'babel-register',
        env: env,
        config: `../${argv.config}`,
        'app-env': argv['app-env']
    };

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

    let tasks = [
        'default'
    ];

    if (!config.staticSite) {
        tasks.push('templates')
    }

    // equivalent of calling
    // gulp tasks --env 'production' --config 'examples/static-site/dvhb.config.js'
    gulp.run(tasks, opts, (err) => {
        // complete!
    });
};
