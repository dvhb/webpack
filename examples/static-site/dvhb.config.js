const path = require('path');

module.exports = {
    template: null,

    assetsDir: [
        'assets', // directory for static images/fonts/video
        'dist'    // webpack output directory
    ],

    extendWebpackConfig(webpackConfig) {
        const dir = path.resolve(__dirname, 'src');

        //update chunkhash for dev/prod mode
        //@todo rewrite assets from manifest.json in templates (express+static-pug)
        webpackConfig.output.filename = '[name].js';
        webpackConfig.output.chunkFilename = '[name].js';

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
