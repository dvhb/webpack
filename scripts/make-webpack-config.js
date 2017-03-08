'use strict';

/* eslint-disable no-console */

const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const ChunkManifestPlugin = require('chunk-manifest-webpack-plugin');
const WebpackMd5Hash = require('webpack-md5-hash');
const WebpackCleanupPlugin = require('webpack-cleanup-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const autoprefixer = require('autoprefixer');
const merge = require('webpack-merge');
const utils = require('./utils/utils');
const prettyjson = require('prettyjson');
const semverUtils = require('semver-utils');
const webpackVersion = semverUtils.parseRange(require('webpack/package.json').version)[0].major;
const isWebpack2 = webpackVersion === '2';
const nodeModulesDir = path.resolve(__dirname, '../node_modules');

function validateWebpackConfig(webpackConfig) {
    webpackConfig.module.loaders.forEach(loader => {
        if (!loader.include && !loader.exclude) {
            throw Error(`DvhbWebpack: "include" option is missing for "${loader.test}" Webpack loader.`);
        }
    });
}

/**
 * Entries
 * @param config
 * @param env
 * @returns {Array}
 */
function getEntries(config, env) {
    let entries = [];

    if (env === 'development') {
        entries.push('webpack-hot-middleware/client?reload=true');
    }

    //svg-sprite
    if (utils.isFileExists(config.svgSpriteDir)) {
        entries.push(path.resolve(__dirname, './entries/svg-sprite.js'));
    }

    //default entry point
    entries.push(path.resolve(config.sourceDir, 'index'));
    return entries;
}

module.exports = function (config, env) {
    process.env.NODE_ENV = process.env.BABEL_ENV = env;

    const isProd = env === 'production';

    let webpackConfig = {
        output: {
            path: config.distDir,
            filename: '[name].js',
            publicPath: config.publicPath
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
            new ManifestPlugin({
                basePath: config.publicPath
            }),
            new ChunkManifestPlugin({
                filename: 'chunk-manifest.json',
                manifestVariable: 'webpackManifest'
            }),
        ],
        module: {
            loaders: [
                {
                    test: /\.js?$/,
                    include: config.sourceDir,
                    loaders: ['babel', 'eslint'],
                },
                {
                    test: /\.pug/,
                    include: config.sourceDir,
                    loader: 'pug'
                },
                {
                    test: /\.json$/,
                    include: config.sourceDir,
                    loader: 'json'
                },
                {
                    test: /\.svg$/,
                    include: config.svgSpriteDir,
                    loader: 'svg-sprite?' + JSON.stringify({
                        name: '[name]',
                        prefixize: false
                    }) + '!svgo'
                },
            ],
        },
        postcss: [
            autoprefixer({
                browsers: ['last 6 versions']
            })
        ],
        eslint: {
            configFile: config.eslintrc
        }
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

    if (isProd) {
        webpackConfig = merge(webpackConfig, {
            output: {
                filename: '[name].[chunkhash].js',
                chunkFilename: '[name].[chunkhash].js'
            },
            entry: getEntries(config, env),
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

                /**
                 * @todo replace with `'[name].[contenthash].css'` when add manifest.json into pug templates
                 */
                new ExtractTextPlugin('[name].css')
            ],
            module: {
                loaders: [
                    {
                        test: /\.css$/,
                        include: config.sourceDir,
                        loader: ExtractTextPlugin.extract('style', 'raw!csso?-restructure!postcss')
                    },
                    {
                        test: /\.styl$/,
                        include: config.sourceDir,
                        loader: ExtractTextPlugin.extract('style', 'raw!csso?-restructure!postcss!stylus')
                    },
                ],
            },
        });
    }
    else {
        webpackConfig = merge(webpackConfig, {
            entry: getEntries(config, env),
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
