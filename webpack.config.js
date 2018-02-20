const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const production = process.env.NODE_ENV === 'production';
const noop = function () {};
const extractSass = new ExtractTextPlugin({
  filename: "[name].css",
  disable: process.env.NODE_ENV === "development"
});

module.exports = {
  entry: [
    'react-hot-loader/patch',
    './src/index.js',
  ],
  output: {
    path: path.resolve(__dirname, 'public/build/'),
    publicPath: 'build/',
    filename: 'bundle.js',
  },
  devServer: {
    contentBase: './public',
    hot: true,
  },
  module: {
    rules: [
      { test: /\.js$/, exclude: /node_modules/, loaders: ['react-hot-loader/webpack', 'babel-loader'] },
      { test: /\.json$/, loader: 'json-loader' },
      { test: /\.css$/, use: ['style-loader', 'css-loader'] },
      { test: /\.scss$/,
        use: extractSass.extract({
          use: [{
            loader: 'css-loader'
          },{
            loader: 'sass-loader',
          }],
          fallback: 'style-loader'
        })},
      {
        test: /\.woff2?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          mimetype: "application/font-woff"
        }
      },
      { test: /\.(ttf|eot|svg|gif)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'file-loader' },
    ]
  },
  plugins: [
    new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /nb/),
    new ExtractTextPlugin("[name].css"),

    // imports and exports loader
    //new webpack.ProvidePlugin({
    //  'fetch': 'imports-loader?this=>global!exports-loader?global.fetch!whatwg-fetch'
    //}),

    production && new webpack.optimize.UglifyJsPlugin({sourceMap: false}) || noop,
    production && new webpack.NoEmitOnErrorsPlugin() || noop,

    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),

    // removes a lot of debugging code in React
    production && new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }) || noop
  ]
};
