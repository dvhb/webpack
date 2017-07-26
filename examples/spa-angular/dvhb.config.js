const path = require('path');

module.exports = {

    spa: true,

    extendWebpackConfig(webpackConfig) {
        const dir = path.resolve(__dirname, 'src');

        // webpackConfig.module.rules.push(
        //     {
        //         test: /\.<extention>?$/,
        //         include: dir,
        //         loader: '<loader>',
        //     }
        // );
        return webpackConfig;
    },
};
