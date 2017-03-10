const path = require('path');

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
