const path = require('path');

module.exports = {
  mode: 'development',
  entry: {
    background: ['webextension-polyfill', './src/background.ts'],
    searchFilters: ['webextension-polyfill', './src/searchFilters/runner.ts'],
  },
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
  }
};
