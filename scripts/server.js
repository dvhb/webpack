'use strict';

const createServer = require('./create-server');

module.exports = function server(config, callback) {
  const env = config.env;
  const serverInfo = createServer(config, env);

  serverInfo.app.listen(config.serverPort, config.serverHost, callback);

  if (config.serverHostNetwork && env == 'development') serverInfo.app.listen(config.serverPort, config.serverHostNetwork);

  return serverInfo.compiler;
};
