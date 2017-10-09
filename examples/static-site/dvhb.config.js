const path = require('path');
const merge = require('webpack-merge');

module.exports = {
  staticSite: true, // enable static site mode

  extendEntries: {
    extEntry: 'extEntry'
  },

  assetsDir: [
    'dist'    // webpack output directory
  ],

  templateVars: {
    googleAnalytics: {
      id: 'A-59965942-1',
    }
  },

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

      plugins: []
    });

    const productionConfig = merge({});

    const developmentConfig = merge({});

    return (env === 'production')? merge(commonConfig, productionConfig) : merge(commonConfig, developmentConfig);
  },
};
