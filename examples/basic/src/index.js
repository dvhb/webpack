/**
 * Entry point for app
 */

import './styles';

import APP_ENV from 'webpack-config-loader!./config';
import './components/btn';
import './components/icon';

console.log('APP_ENV', APP_ENV);
console.log('VERSION', VERSION);
console.log('COMMITHASH', COMMITHASH);

import Modernizr from 'modernizr';
console.log(Modernizr);

//use it for enable HRM
// if (module.hot) {
//     module.hot.accept();
// }
