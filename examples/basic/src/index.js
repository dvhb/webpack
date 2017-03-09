/**
 * Entry point for app
 */

import APP_ENV from 'webpack-config-loader!./config';
import './components/btn';
import './components/icon';

console.log('APP_ENV', APP_ENV);
console.log('VERSION', VERSION);
console.log('COMMITHASH', COMMITHASH);

//use it for enable HRM
// if (module.hot) {
//     module.hot.accept();
// }
