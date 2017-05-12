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
const GitRevisionPlugin = require('git-revision-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const autoprefixer = require('autoprefixer');
const postcssSVG = require('postcss-svg');
const merge = require('webpack-merge');
const utils = require('./utils/utils');
const prettyjson = require('prettyjson');
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
    let entries = {
        main: []
    };

    //default entry point
    entries.main.push(path.resolve(config.sourceDir, 'index'));

    //svg-sprite
    if (utils.isFileExists(config.svgSpriteDir)) {
        entries.main.unshift(path.resolve(__dirname, './entries/svg-sprite.js'));
    }

    //extend default entries
    if (config.extendEntries && typeof config.extendEntries == 'object') {
        entries = merge(entries, config.extendEntries);
    }

    if (env === 'development') {
        let entryKeys = Object.keys(entries);
        entryKeys.forEach(function (e) {
            if (typeof entries[e] === 'string') {
                entries[e] = [entries[e]]
            }
            entries[e].unshift('webpack-hot-middleware/client?reload=true');
        });
    }

    return entries;
}

module.exports = function (config, env) {
    process.env.NODE_ENV = process.env.BABEL_ENV = env;

    const isProd = env === 'production';
    const gitRevisionPlugin = new GitRevisionPlugin();

    let webpackConfig = {
        loader: {
            configEnvironment: config.appEnv
        },
        output: {
            path: config.distDir,
            filename: '[name].js',
            publicPath: config.publicPath
        },
        resolveLoader: {
            moduleExtensions: ['-loader', '.loader'],
        },
        debug: !isProd,
        resolve: {
            extensions: ['', '.js', '.jsx', '.json'],
            root: config.sourceDir,
            moduleDirectories: [
                nodeModulesDir,
                'node_modules',
            ],
        },
        plugins: [
            new webpack.DefinePlugin({
                'process.env': {
                    NODE_ENV: JSON.stringify(env),
                },
                'VERSION': JSON.stringify(gitRevisionPlugin.version()),
                'COMMITHASH': JSON.stringify(gitRevisionPlugin.commithash()),
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
            new GitRevisionPlugin()
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
                    }) + '!svgo?' + JSON.stringify({
                        plugins: [
                            {removeTitle: true},
                            {convertColors: {shorthex: false}},
                            {convertPathData: false}
                        ]
                    })
                },
            ],
        },
        postcss: [
            autoprefixer({
                browsers: ['last 6 versions']
            }),

            //svg inline in css
            postcssSVG({
                paths: [
                    config.svgInlineDir
                ]
            })
        ],
        eslint: {
            configFile: config.eslintrc
        }
    };

    // add modernizr
    if (utils.isFileExists(config.modernizrrc)) {
        webpackConfig = merge(webpackConfig, {
            module: {
                loaders: [
                    {
                        test: /\.modernizrrc.js$/,
                        include: config.sourceDir,
                        loader: "modernizr"
                    },
                    {
                        test: /\.modernizrrc(\.json)?$/,
                        include: config.sourceDir,
                        loader: "modernizr!json"
                    }
                ]
            },
            resolve: {
                alias: {
                    modernizr$: config.modernizrrc
                }
            }
        });
    }

    if (utils.isFileExists(config.template)) {
        webpackConfig.plugins.push(
            new HtmlWebpackPlugin({
                title: config.title,
                template: config.template,
                inject: true,
            }));
    }

    //add CopyWebpackPlugin plugin
    if (utils.isFileExists(config.sourceDir + '/assets')) {
        webpackConfig.plugins.push(new CopyWebpackPlugin([{
            from: path.resolve(config.sourceDir + '/assets'), to: ''
        }], {
            ignore: [
                '*.md',
                '**/svg-inline/*.svg',
                '**/svg-sprite/*.svg'
            ]
        }));
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

                new ExtractTextPlugin('[name].[contenthash].css')
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
            plugins: [
                new webpack.optimize.OccurenceOrderPlugin(),
                new webpack.HotModuleReplacementPlugin(),
                new webpack.NoErrorsPlugin()
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
