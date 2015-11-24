'use strict';
const path = require('path');

module.exports = {
  context: __dirname,
  entry: './bundle.js',
  output: {
    path: __dirname,
    filename: './browser.js'
  },
  module: {
    loaders: [
      {
        test: /\.js?$/,
        loader: 'babel',
        exclude: [path.resolve(__dirname, './node_modules')],
        query: {
          presets: ['es2015']
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
    'lodash': 'lodash',
    'angular': 'angular'
  }
};