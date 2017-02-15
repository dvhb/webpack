# Configuration

You can change settings in the `dvhb.config.js` file in your project’s root folder.

* **`title`**<br>
  Type: `String`, default: `Dvhb Webpack Starter kit`<br>
  Title for index.html.

* **`sourceDir`**<br>
  Type: `String`, default: `src`<br>
  Folder for source code.

* **`distDir`**<br>
  Type: `String`, default: `dist`<br>
  The output directory.

* **`viewsDir`**<br>
  Type: `String`, default: `src/views`<br>
  Folder for `pug` templates.

* **`template`**<br>
  Type: `String`, default: `src/index.html`<br>
  HTML file to use as the template for application.

* **`assetsDir`**<br>
  Type: `String` or `Array`, optional<br>
  Your application static assets folder, will be accessible as `/` in the dev-server or prod-server.

* **`serverHost`**<br>
  Type: `String`, default: `localhost`<br>
  Dev server host name.

* **`serverPort`**<br>
  Type: `Number`, default: `3000`<br>
  Dev server port.

* **`extendWebpackConfig`**<br>
  Type: `Function`, optional<br>
  Function that allows you to extend Webpack config:

  ```javascript
  module.exports = {
    // ...
    extendWebpackConfig(webpackConfig, env) {
      if (env === 'development') {
        // Extend config...
      }
      return webpackConfig;
    },
  };
  ```

* **`configureServer`**<br>
  Type: `Function`, optional<br>
  Function that allows you to add endpoints to the underlying `express` server:

  ```javascript
  module.exports = {
    // ...
    configureServer(app) {
       // `app` is the instance of the express server running dvhb-webpack
    	app.get('/custom-endpoint', (req, res) => {
			  res.status(200).send({ response: 'Server invoked' });
		  });
    },
  };
  ```
