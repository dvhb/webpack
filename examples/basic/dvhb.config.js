const path = require('path');

module.exports = {
    title: 'Webpack Starter kit basic example',

    extendWebpackConfig(webpackConfig) {
        const dir = path.resolve(__dirname, 'lib');
        webpackConfig.module.loaders.push(
            {
                test: /\.css$/,
                include: dir,
                loader: 'style!css?modules&importLoaders=1',
            }
        );
        return webpackConfig;
    },
};
