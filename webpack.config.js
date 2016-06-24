'use strict';
const path = require('path');

module.exports = {
  context: __dirname,
  devtool: 'source-map',
  entry: './bundle.js',
  output: {
    path: __dirname,
    library: 'dmv',
    libraryTarget: 'umd',
    filename: './browser.js'
  },
  module: {
    loaders: [
      {
        test: /(\.js)$/,
        loader: "eslint-loader",
        exclude: /node_modules/
      },
      {
        test: /\.js?$/,
        loader: 'babel',
        exclude: [path.resolve(__dirname, './node_modules')],
        query: {
          presets: ['es2016']
        }
      },
      {
        test: /angular/,
        loader: 'ng-annotate',
        exclude: [path.resolve(__dirname, './node_modules')]
      }
    ]
  },
  externals: {
    'lodash': '_',
    'angular': 'angular'
  }
};