const path = require('path');

module.exports = {
    template: null,

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
