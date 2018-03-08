'use strict';

/* eslint-disable no-console */

const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const WebpackMd5Hash = require('webpack-md5-hash');
const WebpackCleanupPlugin = require('webpack-cleanup-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const merge = require('webpack-merge');
const utils = require('./utils/utils');
const prettyjson = require('prettyjson');

function validateWebpackConfig(webpackConfig) {
  webpackConfig.module.rules.forEach(loader => {
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

  // Try the environment variable, otherwise use root
  const publicPath = process.env.ASSET_PATH || config.publicPath;

  const isProd = env === 'production';

  const postcssLoader = {
    loader: 'postcss-loader',
    options: {
      config: {
        path: path.resolve(__dirname, './postcss.config.js'),
        ctx: {
          svg: {
            paths: config.svgInlineDir
          }
        }
      }
    }
  };

  let webpackConfig = {
    output: {
      path: config.distDir,
      filename: '[name].js'
    },
    resolveLoader: {
      moduleExtensions: ['-loader', '.loader'],
    },
    resolve: {
      modules: [
        config.sourceDir,
        'node_modules'
      ],
      extensions: ['.js', '.jsx', '.json']
    },
    plugins: [
      new webpack.LoaderOptionsPlugin({
        options: {
          loader: {
            configEnvironment: config.appEnv
          },
          eslint: {
            configFile: config.eslintrc
          }
        }
      }),
      new webpack.LoaderOptionsPlugin({
        debug: !isProd
      }),
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify(env)
        }
      }),
      new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor',
        minChunks: function (module) {
          return /node_modules/.test(module.resource);
        }
      }),
      new WebpackMd5Hash(),
      new ManifestPlugin({
        publicPath: publicPath
      }),

      // This makes it possible for us to safely use env vars on our code
      new webpack.DefinePlugin({
        'process.env.ASSET_PATH': JSON.stringify(publicPath)
      })
    ],
    module: {
      rules: [
        {
          test: /\.js?$/,
          include: config.sourceDir,
          use: [{
            loader: 'babel-loader',
            options: {
              // https://github.com/babel/babel-loader#options
              cacheDirectory: !isProd,

              // https://babeljs.io/docs/usage/options/
              babelrc: false,
              extends: config.babelrc,

              presets: [
                // A Babel preset that can automatically determine the Babel plugins and polyfills
                // https://github.com/babel/babel-preset-env
                [
                  '@babel/preset-env',
                  {
                    targets: {
                      browsers: [">1%", "last 4 versions", "Firefox ESR", "not ie < 9"],
                      forceAllTransforms: isProd, // for UglifyJS
                    },
                    modules: false,
                    useBuiltIns: false,
                    debug: false,
                  },
                ],
                // Experimental ECMAScript proposals
                // https://babeljs.io/docs/plugins/#presets-stage-x-experimental-presets-
                '@babel/preset-stage-2',
                // Flow
                // https://github.com/babel/babel/tree/master/packages/babel-preset-flow
                '@babel/preset-flow',
                // JSX
                // https://github.com/babel/babel/tree/master/packages/babel-preset-react
                ['@babel/preset-react', { development: !isProd }],
              ],
              plugins: [
                "lodash",
              ],
            },
          }, 'eslint']
        },
        {
          test: /\.pug/,
          include: config.sourceDir,
          use: 'pug'
        },
        {
          test: /\.json$/,
          include: config.sourceDir,
          use: 'json'
        },
        {
          test: /\.svg$/,
          include: config.svgSpriteDir,
          use: [
            {
              loader: 'svg-sprite-loader',
            },
            {
              loader: 'svgo-loader',
              options: {
                plugins: [
                  { removeTitle: true },
                  { convertColors: { shorthex: false } },
                  { convertPathData: false }
                ]
              }
            }
          ]
        },
        {
          test: /\.(jpe?g|png|woff|woff2|eot|ttf)$/,
          exclude: config.svgSpriteDir,
          loader: 'url-loader?limit=100000'
        }
      ],
    }
  };

  if (utils.isGitExists(config.configDir)) {
    const GitRevisionPlugin = require('git-revision-webpack-plugin');
    const gitRevisionPlugin = new GitRevisionPlugin();

    webpackConfig = merge(webpackConfig, {
      plugins: [
        new webpack.DefinePlugin({
          'VERSION': JSON.stringify(gitRevisionPlugin.version()),
          'COMMITHASH': JSON.stringify(gitRevisionPlugin.commithash()),
        }),
        new GitRevisionPlugin()
      ]
    });
  }

  // add modernizr
  if (utils.isFileExists(config.modernizrrc)) {
    webpackConfig = merge(webpackConfig, {
      module: {
        rules: [
          {
            test: /\.modernizrrc.js$/,
            include: config.sourceDir,
            loader: 'modernizr'
          },
          {
            test: /\.modernizrrc(\.json)?$/,
            include: config.sourceDir,
            loader: 'modernizr!json'
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
        new UglifyJsPlugin({
          parallel: true,
          uglifyOptions: {
            compress: {
              warnings: false,
            },
            output: {
              comments: false,
            },
            mangle: false,
          }
        }),
        new ExtractTextPlugin('[name].[contenthash].css'),
        new BundleAnalyzerPlugin({
          analyzerMode: (config.appEnv === 'development') ? 'static' : 'disable',
          openAnalyzer: false,
          reportFilename: 'report.html',
          logLevel: 'error'
        }),
      ],
      module: {
        rules: [
          {
            test: /\.css$/,
            include: config.sourceDir,
            use: ExtractTextPlugin.extract({
              fallback: 'style',
              use: [
                'css',
                'csso',
                'postcss'
              ]
            })
          },
          {
            test: /\.styl$/,
            include: config.sourceDir,
            use: ExtractTextPlugin.extract({
              fallback: 'style',
              use: [
                'css',
                'csso',
                postcssLoader,
                'stylus'
              ]
            })
          },
        ],
      },
    });
  }
  else {
    webpackConfig = merge(webpackConfig, {
      output: {
        publicPath: '/'
      },
      entry: getEntries(config, env),
      cache: true,
      devtool: 'eval',
      plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new BundleAnalyzerPlugin({
          analyzerMode: 'server',
          openAnalyzer: false,
          logLevel: 'info'
        }),
      ],
      module: {
        rules: [
          {
            test: /\.styl$/,
            include: config.sourceDir,
            use: [
              'style',
              'css',
              postcssLoader,
              'stylus'
            ]
          },
          {
            test: /\.css$/,
            include: config.sourceDir,
            use: [
              'style',
              'css'
            ]
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
