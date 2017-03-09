"use strict";

const minimist = require('minimist');
const chalk = require('chalk');
const argv = minimist(process.argv.slice(2));

const gulp = require('gulp');
const pug = require('gulp-pug');
const filter = require('gulp-filter');

const getConfig = require('../../scripts/config');
const DvhbWebpackError = require('../../scripts/utils/error');
const utils = require('../../scripts/utils/utils');
const consts = require('../../scripts/consts');

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
