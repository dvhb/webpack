/**
 * svg-sprite in document.body
 *
 * @see https://github.com/kisenka/svg-sprite-loader
 *
 * Webpack loader
 * {
 *     test: /\.svg$/,
 *     include: path.resolve(__dirname, 'assets/svg-sprite'),
 *         loader: 'svg-sprite?' + JSON.stringify({
 *         name: '[name]',
 *         prefixize: false
 *     })
 * }
 *
 * Use in html for assets/svg-sprite/logo.svg
 * <svg>
 *    <use xlink:href="#logo"></use>
 * </svg>
 *
 */
let files = require.context('assets/svg-sprite', false, /\.svg$/);
files.keys().forEach(files);
