"use strict";
const path = require("path");
const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCssAssetsWebpackPlugin = require("optimize-css-assets-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CleanWebpackPlugin  = require("clean-webpack-plugin");
const glob = require('glob')

const setMPA = () => {
  const entry = {}
  const htmlWebpackPlugin= []
  const entryFiles = glob.sync(path.join(__dirname, './src/*/index.js'))

  Object.keys(entryFiles).map(index => {
    const entryFile = entryFiles[index]
    // console.log('entryFile', entryFile);
    const match = entryFile.match(/src\/(.*)\/index\.js/)
    const pageName = match && match[1]
    entry[pageName] = entryFile
    htmlWebpackPlugin.push(    new HtmlWebpackPlugin({
      template: path.join(__dirname, `./src/${pageName}/index.html`),
      filename: `${pageName}.html`,
      chunk: [pageName],
      inject: true,
      minify: {
        html5: true,
        collapseWhitespace: true,
        preserveLineBreaks: false,
        minifyCSS: true,
        minifyJS: true,
        removeComments: false,
      },
    }),)
  })
  return {
    entry,
    htmlWebpackPlugin
  }
}
const {entry, htmlWebpackPlugin} =  setMPA()

module.exports = {
  entry,
  output: {
    path: path.join(__dirname, "dist"),
    filename: "[name]_[chunkhash:8].js",
  },
  module: {
    rules: [
      { test: /\.js$/, use: "babel-loader" },
      {
        test: /\.less$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          "less-loader",
          {
            loader: "postcss-loader",
            options: {
              plugins: [
                require("autoprefixer")({
                  browsers: ["last 2 version", ">1%", "ios 7"],
                }),
              ],
            },
          },
          {
            loader: "px2rem-loader",
            options: {
              remUnit: 75,
              remPrecesion: 8,
            },
          },
        ],
      },
      {
        test: /\.(png|jpg|jepg)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name]_[hash:8].[ext]",
              // limit: 10240,
            },
          },
        ],
      },
    ],
  },
  plugins: [
    ...htmlWebpackPlugin,
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: "[name][contenthash:8].css",
    }),
    new OptimizeCssAssetsWebpackPlugin({
      assetNameRegExp: /\.css$/g,
    }),
  ],
  // mode: "production",
  // devtool: 'source-map'
};
