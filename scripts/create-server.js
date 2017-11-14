'use strict';

const express = require('express');
const webpack = require('webpack');
const makeWebpackConfig = require('./make-webpack-config');
const pugStatic = require('./utils/express-pug');
const utils = require('./utils/utils');
const colorsSupported = require('supports-color');

module.exports = function createServer(config, env) {
  const webpackConfig = makeWebpackConfig(config, env);
  const compiler = webpack(webpackConfig);
  const app = express();

  if (env === 'development') {
    // register webpack middlewares
    app.use(require('webpack-dev-middleware')(compiler, {
      noInfo: false,
      stats: webpackConfig.stats || {
        colors: colorsSupported,
        chunks: false,
        modules: false
      },
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
    app.set("view options", {layout: false});

    // user defined customizations
    if (config.configureServer) {
      config.configureServer(app, env);
    }

    app.use(pugStatic({
      root: config.viewsDir
    }));

    //assets manifest. Used in production mode only
    if (env === 'production') {
      const manifestDir = config.distDir + '/manifest.json';
      if (utils.isFileExists(manifestDir)) {
        app.locals.manifest = require(manifestDir)
      }
    }

    //template global variables
    app.locals.templateVars = config.templateVars;

    if (config.spa) {
      //spa entry for all routes
      app.use(function (req, res) {
        res.status(200);
        res.render('index');
      });
    } else {
      //404 error handler
      if (utils.isFileExists(config.viewsDir + '/404/index.pug')) {
        app.use(function (req, res) {
          res.status(404);
          res.render('404');
        });
      }
    }
  }

  /**
   * Local variables in express app
   * @see http://expressjs.com/en/api.html#app.locals
   */
  app.locals.env = env;

  return { app, compiler };
};
