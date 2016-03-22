var webpack = require('webpack');
var path = require('path');

var production = process.env.NODE_ENV === 'production';
var noop = function () {};

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'public/build/'),
    publicPath: 'build/',
    filename: 'bundle.js',
  },
  module: {
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loaders: ['react-hot', 'babel-loader'] },
      { test: /\.json$/, loader: 'json' },
      { test: /\.css$/, loader: 'style!css' },
      { test: /\.scss$/, loader: 'style!css!sass' },
      { test: /\.woff2?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'url-loader?limit=10000&minetype=application/font-woff' },
      { test: /\.(ttf|eot|svg|gif)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'file-loader' },
    ]
  },
  plugins: [
    production && new webpack.optimize.DedupePlugin() || noop,
    production && new webpack.optimize.UglifyJsPlugin({sourceMap: false}) || noop,
    production && new webpack.NoErrorsPlugin() || noop,
    production && new webpack.optimize.OccurenceOrderPlugin() || noop,

    // removes a lot of debugging code in React
    production && new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }) || noop
  ]
};
