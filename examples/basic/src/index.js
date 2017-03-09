/**
 * Entry point for app
 */

import appEnv from 'webpack-config-loader!./config';
console.log(appEnv);

import './components/btn';
import './components/icon';

//use it for enable HRM
// if (module.hot) {
//     module.hot.accept();
// }
