var webpack = require('webpack');

/*
 * --------
 *  CONFIG
 * --------
 */

var BUILD_ENV = process.env.BUILD_ENV || 'development';

var deployConfig;

try {
  deployConfig = require('./deploy.config.js')[BUILD_ENV] || {};
} catch (e) {
  console.log('WARNING: No deploy.config.js found.');
  deployConfig = {
    clientConfig: 'development',
    debug: true,
  };
}

//replaces require('config') in application js files with the
//contents of /config/<env>.js as defined by `clientConfig`
//key in the deployConfig file
var clientConfig = deployConfig.clientConfig;
var replaceConfig = new webpack.NormalModuleReplacementPlugin(
    /^config$/,
    __dirname + '/config/' + clientConfig + '.js'
);

var publicPath = '/dist/';


/*
 * -------
 *  SETUP
 * -------
 */

module.exports = {
  debug: deployConfig.debug,
  devtool: deployConfig.debug ? 'eval' : undefined,

  entry: {
    'expense-tracker': './js/app.js'
  },

  output: {
    path: __dirname + '/dist',
    filename: '[name].min.js',
    publicPath: publicPath
  },

  module: {
    exprContextRecursive: false,
    exprContextCritical: false,

    preLoaders: [
      { test: /\.js$/, exclude: /node_modules/, loader: 'jscs-loader' }
    ],

    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel' },
    ]
  },

  plugins: [
    replaceConfig
  ]
};
