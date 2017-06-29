'use strict';

const webpack = require('webpack');
const makeWebpackConfig = require('./make-webpack-config');
const gulp = require('../gulp');
const colorsSupported = require('supports-color');

module.exports = function build(config, callback) {
    let env = 'production';

    return webpack(makeWebpackConfig(config, env), (err, stats) => {
        // require('fs').writeFileSync('stats.json', JSON.stringify(stats.toJson()));

        console.log(stats.toString({
            colors: colorsSupported,
            chunks: false,
            errorDetails: true
        }));

        gulp(config, env, () => {
            callback(err, stats);
        })
    });
};
