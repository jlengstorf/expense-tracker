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

/*
 * webpack plugin to replace:
 *
 *     import config from 'config';
 *
 * with the contents of `/config/<env>.js`.
 *
 * The value of <env> is set in `./deploy.config.js` as `clientConfig`.
 */
var replaceConfig = new webpack.NormalModuleReplacementPlugin(
    /^config$/,
    __dirname + '/config/' + deployConfig.clientConfig + '.js'
);


/*
 * ---------
 *  PostCSS
 * ---------
 */

var PostCssImport = require('postcss-import')({ glob: true });
var PostCssNested = require('postcss-nested');
var PostCssSimpleVars = require('postcss-simple-vars');
var CssNext = require('cssnext')();
var CssNano = require('cssnano')();

// CSS should be extracted to a separate file
var ExtractTextPlugin = require("extract-text-webpack-plugin");


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
    publicPath: '/dist/',
  },

  module: {
    exprContextRecursive: false,
    exprContextCritical: false,

    preLoaders: [
      { test: /\.js$/, exclude: /node_modules/, loader: 'jscs-loader' }
    ],

    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel?sourceMap' },
      { test: /\.css$/, loader: 'style!css!postcss-loader?sourceMap' },
      { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url-loader?limit=10000&mimetype=application/font-woff" },
      { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file-loader" },
    ]
  },

  postcss: function () {
    return [
      PostCssImport,
      PostCssNested,
      PostCssSimpleVars,
      CssNext,
      CssNano
    ];
  },

  plugins: [
    replaceConfig,
  ]
};
