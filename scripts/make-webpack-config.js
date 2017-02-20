'use strict';

/* eslint-disable no-console */

const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const ChunkManifestPlugin = require('chunk-manifest-webpack-plugin');
const WebpackMd5Hash = require('webpack-md5-hash');
const WebpackCleanupPlugin = require('webpack-cleanup-plugin');
const merge = require('webpack-merge');
const prettyjson = require('prettyjson');
const semverUtils = require('semver-utils');
const webpackVersion = semverUtils.parseRange(require('webpack/package.json').version)[0].major;
const isWebpack2 = webpackVersion === '2';
const nodeModulesDir = path.resolve(__dirname, '../node_modules');

// experimental
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const autoprefixer = require('autoprefixer');

function validateWebpackConfig(webpackConfig) {
    webpackConfig.module.loaders.forEach(loader => {
        if (!loader.include && !loader.exclude) {
            throw Error('DvhbWebpack: "include" option is missing for ' + loader.test + ' Webpack loader.');
        }
    });
}

module.exports = function (config, env) {
    process.env.NODE_ENV = process.env.BABEL_ENV = env;

    const isProd = env === 'production';

    let webpackConfig = {
        output: {
            path: config.distDir,
            filename: '[name].js'
        },
        resolveLoader: {
            moduleExtensions: ['-loader', '.loader'],
        },
        plugins: [
            new webpack.DefinePlugin({
                'process.env': {
                    NODE_ENV: JSON.stringify(env),
                },
            }),
            new webpack.optimize.CommonsChunkPlugin({
                name: 'vendor',
                minChunks: function (module) {
                    return /node_modules/.test(module.resource);
                }
            }),
            new WebpackMd5Hash(),
            new ManifestPlugin(),
            new ChunkManifestPlugin({
                filename: "chunk-manifest.json",
                manifestVariable: "webpackManifest"
            }),
        ],
        module: {
            loaders: [],
        },
        postcss: [
            autoprefixer({
                browsers: ['last 6 versions']
            })
        ],
    };

    if (config.template) {
        webpackConfig.plugins.push(
            new HtmlWebpackPlugin({
                title: config.title,
                template: config.template,
                inject: true,
            }));
    }

    const loaderModulesDirectories = [
        nodeModulesDir,
        'node_modules',
    ];

    if (isWebpack2) {
        webpackConfig = merge(webpackConfig, {
            resolve: {
                extensions: ['.js', '.jsx', '.json'],
                modules: [
                    config.sourceDir,
                    nodeModulesDir,
                    'node_modules',
                ],
            },
            resolveLoader: {
                modules: loaderModulesDirectories,
            },
            plugins: [
                new webpack.LoaderOptionsPlugin({
                    minimize: isProd,
                    debug: !isProd
                }),
            ],
        });
    }
    else {
        webpackConfig = merge(webpackConfig, {
            resolve: {
                extensions: ['', '.js', '.jsx', '.json'],
                root: config.sourceDir,
                moduleDirectories: [
                    nodeModulesDir,
                    'node_modules',
                ],
            },
            resolveLoader: {
                modulesDirectories: loaderModulesDirectories,
            },
            debug: !isProd,
        });
    }

    const entryScript = path.resolve(config.sourceDir, 'index');

    if (isProd) {
        webpackConfig = merge(webpackConfig, {
            output: {
                filename: '[name].[chunkhash].js',
                chunkFilename: '[name].[chunkhash].js'
            },
            entry: [
                entryScript,
            ],
            devtool: false,
            cache: false,
            plugins: [
                new WebpackCleanupPlugin({
                    quiet: true,
                }),
                new webpack.optimize.DedupePlugin(),
                new webpack.optimize.UglifyJsPlugin({
                    compress: {
                        warnings: false,
                    },
                    output: {
                        comments: false,
                    },
                    mangle: false,
                }),
                new ExtractTextPlugin('[name].[contenthash].css')
            ],
            module: {
                loaders: [
                    {
                        test: /\.css$/,
                        include: config.sourceDir,
                        loader: ExtractTextPlugin.extract("style", "raw!csso?-restructure!postcss")
                    },
                    {
                        test: /\.styl$/,
                        include: config.sourceDir,
                        loader: ExtractTextPlugin.extract("style", "raw!csso?-restructure!postcss!stylus")
                    },
                ],
            },
        });
    }
    else {
        webpackConfig = merge(webpackConfig, {
            entry: [
                'webpack-hot-middleware/client?reload=true',
                entryScript,
            ],
            cache: true,
            devtool: 'eval',
            stats: {
                colors: true,
                reasons: true,
            },
            plugins: [
                new webpack.optimize.OccurenceOrderPlugin(),
                new webpack.HotModuleReplacementPlugin(),
                new webpack.NoErrorsPlugin(),
            ],
            module: {
                loaders: [
                    {
                        test: /\.styl$/,
                        include: config.sourceDir,
                        loader: 'style!raw!postcss!stylus'
                    },
                    {
                        test: /\.css$/,
                        include: config.sourceDir,
                        loader: 'style!raw'
                    }
                ],
            },
        });
    }

    if (config.extendWebpackConfig) {
        webpackConfig = config.extendWebpackConfig(webpackConfig, env);
        validateWebpackConfig(webpackConfig);
    }

    if (config.verbose) {
        console.log();
        console.log('Using Webpack config:');
        console.log(prettyjson.render(webpackConfig));
        console.log();
    }

    return webpackConfig;
};
