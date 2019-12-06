const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const merge = require('webpack-merge');

const common = {
  mode: 'production',
  node: {
    __dirname: false,
    __filename: false,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: "babel-loader"
      },
      {
        test: /\.(jpg|png|svg|ico|icns)$/,
        use: {
          loader: 'file-loader',
          options: {
            name: '[path][name].[ext]',
          }
        }
      },
      {
        test: /\.(eot|ttf|woff|woff2)$/,
        use: {
          loader: 'file-loader',
          options: {
            name: '[path][name].[ext]',
          }
        }
      },
    ]
  }
}

const renderer = merge.smart(common, {
  target: 'electron-renderer',
  resolve: {
    extensions: ['.js', '.jsx', '.json'],
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.(sass|scss|css)$/,
        use: [
          'style-loader',
          'css-loader?sourceMap',
          'sass-loader?sourceMap',
        ],
      },
      {
        test: /\.(jpg|png|svg|ico|icns)$/,
        use: {
          loader: 'file-loader',
          options: {
            name: '[path][name].[ext]',
          }
        }
      },
      {
        test: /\.(eot|ttf|woff|woff2)$/,
        use: {
          loader: 'file-loader',
          options: {
            name: '[path][name].[ext]',
          }
        }
      }
    ],
  }
});

const mainConfig = merge.smart(common, {
  entry: './src/main/main.js',
  target: 'electron-main',
  output: {
    filename: 'main.bundle.js',
    path: __dirname + '/dist',
  },
  resolve: {
    extensions: ['.js', '.json'],
  }
});

const rendererConfig = merge.smart(renderer, {
  entry: './src/renderer/renderer.jsx',
  output: {
    filename: 'renderer.bundle.js',
    path: __dirname + '/dist',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './src/renderer/index.ejs'),
      templateParameters: {
        dev: false
      }
    })
  ]
});

const initializerConfig = merge.smart(renderer, {
  entry: './src/renderer/initializer.jsx',
  output: {
    filename: 'initializer.bundle.js',
    path: __dirname + '/dist',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './src/renderer/init.html'),
      filename: 'init.html',
      templateParameters: {
        dev: false
      }
    })
  ]
});

module.exports = [mainConfig, rendererConfig, initializerConfig];
