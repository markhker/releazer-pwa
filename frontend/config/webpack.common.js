const Dotenv = require('dotenv-webpack')
const commonPaths = require('./commonPaths')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const PnpWebpackPlugin = require('pnp-webpack-plugin')
const path = require('path')
const root = path.join.bind(path, __dirname)

const config = {
  entry: ['@babel/polyfill', `${commonPaths.appEntry}/index.js`],
  output: {
    path: commonPaths.outputPath,
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        use: {
          loader: require.resolve('babel-loader')
        }
      },
      {
        test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/, /\.svg$/],
        loader: require.resolve('url-loader'),
        options: {
          limit: 1000,
          name: 'static/media/[name].[hash:8].[ext]',
          include: [
            root('src/assets'),
            root('src/components')
          ]
        }
      },
    ]
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          chunks: 'initial',
          test: 'vendor',
          name: 'vendor',
          enforce: true
        }
      }
    }
  },
  resolve: {
    plugins: [
      PnpWebpackPlugin
    ]
  },
  resolveLoader: {
    plugins: [
      PnpWebpackPlugin.moduleLoader(module)
    ]
  },
  plugins: [
    new Dotenv({
      systemvars: true
    }),
    new HtmlWebpackPlugin({
      template: 'public/index.html',
      favicon: 'public/favicon.ico',
      hash: true
    }),
    new CleanWebpackPlugin()
  ]
}

module.exports = config
