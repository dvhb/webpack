'use strict';

const express = require('express');
const webpack = require('webpack');
const makeWebpackConfig = require('./make-webpack-config');
const pugStatic = require('express-pug');

module.exports = function createServer(config, env) {
    const webpackConfig = makeWebpackConfig(config, env);
    const compiler = webpack(webpackConfig);
    const app = express();

    if (env === 'development') {
        // register webpack middlewares
        app.use(require('webpack-dev-middleware')(compiler, {
            noInfo: true,
            stats: webpackConfig.stats || {},
        }));

        app.use(require('webpack-hot-middleware')(compiler));
    }

    // configure static assets
    if (config.assetsDir) {
        if (typeof config.assetsDir === 'string') {
            app.use(express.static(config.assetsDir));
        }
        if (Array.isArray(config.assetsDir)) {
            config.assetsDir.forEach(function (path) {
                app.use(express.static(path));
            });
        }
    }

    // configure static template files, use template engine pug
    if (config.viewsDir) {
        app.set('view engine', 'pug');
        app.set('views', config.viewsDir);

        app.use(pugStatic({
            root: config.viewsDir
        }));

        // user defined customizations
        if (config.configureServer) {
            config.configureServer(app, env);
        }

        //404 error handler
        app.use(function (req, res) {
            res.status(404);
            res.render('404');
        });
    }

    /**
     * Local variables in express app
     * @see http://expressjs.com/en/api.html#app.locals
     */
    app.locals.env = env;

    return {app, compiler};
};
