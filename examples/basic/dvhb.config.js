const path = require('path');
const merge = require('webpack-merge');

module.exports = {
  title: '@dvhb/webpack',

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
