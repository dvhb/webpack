const path = require('path');

module.exports = {
    title: 'Webpack Starter kit basic example',

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
    },
};
