const webpack = require('webpack')
const fs = require('fs')
const path = require('path')
const PORT = process.env.PORT || 4005

const config = {
  mode: 'development',
  output: {
    filename: '[name].[hash].js'
  },
  devtool: 'inline-source-map',
  plugins: [
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin()
  ],
  devServer: {
    host: 'localhost',
    port: PORT,
    historyApiFallback: true,
    noInfo: false,
    hot: true,
    open: false,
  }
}

module.exports = config
