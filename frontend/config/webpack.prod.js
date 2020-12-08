const TerserPlugin = require('terser-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const commonPaths = require('./commonPaths')

const config = {
  mode: 'production',
  output: {
    filename: 'static/[name].[hash].js'
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()]
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [{ from: 'public', to: commonPaths.outputPath }],
    }),
  ]
}

module.exports = config
