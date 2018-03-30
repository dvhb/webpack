# Configuration

You can change settings in the `dvhb.config.js` file in your project’s root folder.

## `title`
Type: `String`, default: `Dvhb Webpack Starter kit`

Title for index.html.

## `sourceDir`
Type: `String`, default: `src`

Folder for source code.

## `distDir`
Type: `String`, default: `dist`

The output directory.

## `publicPath`
Type: `String`, default: `/`

Public path for assets.

## `viewsDir`
Type: `String`, default: `src/views`

Folder for `pug` templates.

## `staticSite`
Type: `Boolean`, default: `false`

Enable static site mode with express server.

## `assetsDir`
Type: `String` or `Array`, optional

Your application static assets folder, will be accessible as `/` in the dev-server or prod-server.

## `serverHost`
Type: `String`, default: `localhost`

Development server host name.

## `serverPort`
Type: `Number`, default: `3000`

Dev server port.

## `eslintrc`
Type: `String`, default: `.eslintrc`

Use ESLint config [https://github.com/dvhb/eslint-config](@dvhb/eslint-config).

You can use your own eslint config if exists `<project_dir>/.eslintrc`

## `modernizrrc`
Type: `String`, default: `src/.modernizrrc`

Use modernizer in application.

## `templateVars`
Type: `Object`, default: `{}`

Template global vars, useful for google analitics and other specific data.

## `spa`
Type: `String`, default: `false`

Use spa routing with html5mode.

## `extendEntries`
Type: `Object`, optional

Extend app entries. Example for `src/extEntry.js`:

```javascript
module.exports = {
  // ...
  extendEntries: {
    extEntry: 'extEntry'
  },
};
```


## `extendWebpackConfig`
Type: `Function`, optional

Function that allows you to extend Webpack config:

```javascript
module.exports = {
  const merge = require('webpack-merge');
  const path = require('path');

  // ...
  /**
   * Extend webpack configuration
   *
   * @param webpackConfig {Object} – webpack config
   * @param env {String} – environment
   */
  extendWebpackConfig(webpackConfig, env) {
    const dir = path.resolve(__dirname, 'src');

    // @see https://webpack.js.org/configuration/
    const commonConfig = merge(webpackConfig, {
      module: {
        rules: [
          {
            test: /\.<extention>?$/,
            include: dir,
            loader: '<loader>',
          }
        ],
      },

      plugins: []
    });

    const productionConfig = merge({});

    const developmentConfig = merge({});

    return (env === 'production')? merge(commonConfig, productionConfig) : merge(commonConfig, developmentConfig);
  }
};
```

## `configureServer`
Type: `Function`, optional

Function that allows you to add endpoints to the underlying `express` server:

```javascript
module.exports = {
  // ...
  /**
   * Extend express server behavior
   *
   * @param app – instance of the express server running dvhb-webpack
   * @param env {String} – environment
   */
  configureServer(app, env) {
    app.get('/custom-endpoint', (req, res) => {
      res.status(200).send({ response: 'Server invoked' });
    });

    // use items variable in templates
    app.locals.items = require('./src/items.json');
  },
};
```
