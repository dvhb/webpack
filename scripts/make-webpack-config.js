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
const autoprefixer = require('autoprefixer');
const postcssSVG = require('postcss-svg');
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

  let webpackConfig = {
    output: {
      path: config.distDir,
      filename: '[name].js',
      publicPath: publicPath
    },
    resolveLoader: {
      moduleExtensions: ['-loader', '.loader'],
    },
    resolve: {
      modules: [
        config.sourceDir,
        "node_modules"
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
          svgoConfig: {
            plugins: [
              { removeTitle: true },
              { convertColors: { shorthex: false } },
              { convertPathData: false }
            ]
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
          use: ['babel', 'eslint']
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
            'svg-sprite?' + JSON.stringify({
              name: '[name]',
              prefixize: false
            }),
            'svgo?useConfig=svgoConfig'
          ]
        },
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
        rules: [
          {
            test: /\.css$/,
            include: config.sourceDir,
            use: ExtractTextPlugin.extract({
              fallback: "style",
              use: [
                'raw',
                'csso',
                'postcss'
              ]
            })
          },
          {
            test: /\.styl$/,
            include: config.sourceDir,
            use: ExtractTextPlugin.extract({
              fallback: "style",
              use: [
                'raw',
                'csso',
                'postcss',
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
      entry: getEntries(config, env),
      cache: true,
      devtool: 'eval',
      plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin()
      ],
      module: {
        rules: [
          {
            test: /\.styl$/,
            include: config.sourceDir,
            use: [
              'style',
              'raw',
              'postcss',
              'stylus'
            ]
          },
          {
            test: /\.css$/,
            include: config.sourceDir,
            use: [
              'style',
              'raw'
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
