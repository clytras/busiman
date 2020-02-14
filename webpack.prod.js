require('dotenv').config();
const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CspHtmlWebpackPlugin = require('csp-html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const package = require('./package.json');

const cspPlugin = {
  policy: {
    'base-uri': ["'self'", 'http://localhost:*/'],
    'font-src': ["'self'", 'http://localhost:*/'],
    'img-src': ['data:', "'unsafe-eval'", 'file://*', 'http://localhost:*/'],
    'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'", , 'ws://localhost:*/', 'http://localhost:*/'],
    'style-src': ["'self'", "'unsafe-inline'"],
    'connect-src': ["'self'", 'ws://localhost:*/', 'http://localhost:*/']
  }
}

const common = {
  mode: 'production',
  node: {
    __dirname: false,
    __filename: false,
  },
  externals: {
    knex: 'commonjs knex'
  },
  module: {
    rules: [
      {
        test: /\.js(x)?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
            // babelrc: false,
            // presets: [
            //   ['@babel/preset-env', { targets: { browsers: 'chrome 78' } }],
            //   '@babel/preset-react',
            // ],
            plugins: [
              ['@babel/plugin-transform-runtime', { regenerator: true }],
              ['@babel/plugin-proposal-class-properties', { loose: true }]
            ],
          },
        },
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
  output: {
    filename: 'renderer.bundle.js',
    path: __dirname + '/dist',
  },
  resolve: {
    modules: ['node_modules'],
    // alias: {
    //   'react-dom': '@hot-loader/react-dom',
    // },
    extensions: ['.js', '.jsx', '.json'],
  },
  plugins: [new webpack.NamedModulesPlugin()],
  devtool: 'cheap-eval-source-map',
  // devServer: {
  //   contentBase: path.join(__dirname, 'dist'),
  //   compress: true,
  //   port,
  //   disableHostCheck: true,
  //   allowedHosts: [
  //     'localhost'
  //   ]
  // },
  module: {
    rules: [
      {
        test: /\.(sass|scss|css)$/,
        use: [
          'style-loader',
          'css-loader?sourceMap',
          'sass-loader?sourceMap',
        ],
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
    modules: ['node_modules'],
    extensions: ['.js', '.jsx', '.json'],
  },
  plugins: [
    new webpack.DefinePlugin({
      PACKAGE: {
        name: JSON.stringify(package.name),
        shortName: JSON.stringify(package.shortName),
        productName: JSON.stringify(package.productName),
        version: JSON.stringify(package.version),
      }
    }),
    new CopyWebpackPlugin([{
      from: './migrations',
      to: 'migrations/'
    }])
  ]
});

const plugins = ['init', 'setup', 'app']
.map(windowId => new HtmlWebpackPlugin({
  filename: `${windowId}.html`,
  template: path.resolve(__dirname, './src/renderer/renderer.ejs'),
  templateParameters: (compilation, assets, options) => ({
    windowId,
    title: package.productName,
    dev: false,
    webpackConfig: compilation.options
  }),
  cspPlugin
}))
.concat([
  new CspHtmlWebpackPlugin()
]);


const rendererConfig = merge.smart(renderer, {
  entry: './src/renderer/renderer.jsx',
  output: {
    filename: 'renderer.bundle.js',
    // path: __dirname + '/dist',
  },
  plugins
});

// const initializerConfig = merge.smart(renderer, {
//   entry: './src/renderer/initializer.jsx',
//   output: {
//     filename: 'initializer.bundle.js',
//     // path: __dirname + '/dist',
//   },
//   plugins: [
//     new HtmlWebpackPlugin({
//       filename: 'init.html',
//       template: path.resolve(__dirname, './src/renderer/init.html'),
//       templateParameters: (compilation, assets, options) => ({
//         dev: true,
//         webpackConfig: compilation.options
//       }),
//       cspPlugin
//     }),
//     new CspHtmlWebpackPlugin()
//   ]
// });

// module.exports = [mainConfig, rendererConfig, initializerConfig];
module.exports = [mainConfig, rendererConfig];
