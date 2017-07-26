const path = require('path');
const webpack = require('webpack');

module.exports = {
    title: '<%= data.appTitle %>',

    templateVars: {
        googleAnalytics: {
            id: 'XXX',
        }
    },

    extendWebpackConfig(webpackConfig) {
        const dir = path.resolve(__dirname, 'src');

        // webpackConfig.module.rules.push(
        //     {
        //         test: /\.<extention>?$/,
        //         include: dir,
        //         loader: '<loader>',
        //     }
        // );

        // подключим jquery
        webpackConfig.plugins.push(new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery'
        }));

        return webpackConfig;
    }
};
