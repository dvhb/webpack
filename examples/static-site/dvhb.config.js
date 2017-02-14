const path = require('path');

module.exports = {
    template: null,

    assetsDir: 'assets',

    distDir: 'assets',

    extendWebpackConfig(webpackConfig) {
        const dir = path.resolve(__dirname, 'src');

        webpackConfig.module.loaders.push(
            {
                test: /\.js?$/,
                include: dir,
                loader: 'babel',
            }
        );

        return webpackConfig;
    }
};
