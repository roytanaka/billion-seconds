const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MomentLocalesPlugin = require('moment-locales-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (env, options) => {
  console.log(`Webpack in ${options.mode} mode`);
  return {
    entry: './src/index.js',
    devtool: 'inline-source-map',
    devServer: {
      contentBase: './dist',
      hot: true,
      open: 'Google Chrome',
      host: '0.0.0.0',
    },
    plugins: [
      new CleanWebpackPlugin({
        cleanOnceBeforeBuildPatterns: ['**/*', '!index.html'],
      }),
      new MomentLocalesPlugin(),
      new MiniCssExtractPlugin(),
      new HtmlWebpackPlugin({
        template: './src/index.html',
      })
  
    ],
    module: {
      rules: [
        {
          test: /\.s[ac]ss$/i,
          use: [
            options.mode === 'development'
              ? 'style-loader'
              : MiniCssExtractPlugin.loader,
            // 'style-loader',
            'css-loader',
            'postcss-loader',
            'sass-loader',
          ],
        },
        {
          test: /\.css$/i,
          use: ['style-loader', 'css-loader', 'postcss-loader'],
        },
        {
          test: /\.m?js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
            },
          },
        },
        { test: /\.hbs$/i, loader: 'handlebars-loader' },
      ],
    },
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'dist'),
    },
  };
};
