/**
 * Entry point for app
 */

import './styles';
import './app';

import APP_ENV from 'webpack-config-loader!./config';

console.log('APP_ENV', APP_ENV);

import Modernizr from 'modernizr';
console.log(Modernizr);

//use it for enable HRM
// if (module.hot) {
//   module.hot.accept();
// }
