const path = require('path');

module.exports = {
    template: null,

    assetsDir: [
        'assets', // directory for static images/fonts/video
        'dist'    // webpack output directory
    ],

    templateVars: {
        googleAnalytics: {
            id: 'A-59965942-1',
        }
    },

    extendWebpackConfig(webpackConfig) {
        const dir = path.resolve(__dirname, 'src');

        // webpackConfig.module.loaders.push(
        //     {
        //         test: /\.<extention>?$/,
        //         include: dir,
        //         loader: '<loader>',
        //     }
        // );

        return webpackConfig;
    }
};
