const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');

module.exports = {
  title: '<%= data.appTitle %>',

  templateVars: {
    googleAnalytics: {
      id: 'XXX',
    }
  },

  /**
   * Extend webpack configuration
   *
   * @param webpackConfig {Object} – webpack config
   * @param env {String} – environment, example dvhb-webpack build --app-env=development
   */
  extendWebpackConfig(webpackConfig, env) {
    const dir = path.resolve(__dirname, 'src');

    // @see https://webpack.js.org/configuration/
    const commonConfig = merge(webpackConfig, {
      module: {
        rules: [
          // {
          //   test: /\.<extention>?$/,
          //   include: dir,
          //   loader: '<loader>',
          // }
        ],
      },

      plugins: [
        new webpack.ProvidePlugin({
          _: 'lodash',
          $: 'jquery',
          jQuery: 'jquery',
          'window.jQuery': 'jquery'
        }),
      ]
    });

    const productionConfig = merge({});

    const developmentConfig = merge({});

    return (env === 'production')? merge(commonConfig, productionConfig) : merge(commonConfig, developmentConfig);
  },

  /**
   * Extend express server behavior
   *
   * @param app – instance of the express server running dvhb-webpack
   * @param env {String} – environment, example dvhb-webpack build --app-env=development
   */
  configureServer(app, env) {
    // use items variable in templates
    // app.locals.items = require('./src/items.json');
  },
};
