'use strict';

const webpack = require('webpack');
const makeWebpackConfig = require('./make-webpack-config');
const gulpRunner = require('../gulp/gulp-runner');

module.exports = function build(config, callback) {
    let env = 'production';

    return webpack(makeWebpackConfig(config, env), (err, stats) => {
        // require('fs').writeFileSync('stats.json', JSON.stringify(stats.toJson()));

        gulpRunner(config, env, () => {
            callback(err, stats);
        })
    });
};
