/* eslint-disable global-require */
const pkg = require('../package.json');

module.exports = ({ file, options, env }) => ({
  // The list of plugins for PostCSS
  // https://github.com/postcss/postcss
  plugins: [
    // Transfer @import rule by inlining content, e.g. @import 'normalize.css'
    // https://github.com/postcss/postcss-import
    require('postcss-import')(),
    // Unwraps nested rules like how Sass does it
    // https://github.com/postcss/postcss-nested
    require('postcss-nested')(),
    // Postcss flexbox bug fixer
    // https://github.com/luisrudge/postcss-flexbugs-fixes
    require('postcss-flexbugs-fixes')(),
    // Implements tomorrow css syntax
    // http://cssnext.io/features/
    require('postcss-cssnext')({
      features: {
        // Add vendor prefixes to CSS rules using values from caniuse.com
        // https://github.com/postcss/autoprefixer
        autoprefixer: {
          browsers: pkg.browserslist,
          flexbox: 'no-2009',
        },
      },
    }),
    require('postcss-svg')({
      dirs: [options.svg.paths]
    })
  ],
});
