const path = require("path")
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin")
const CleanWebpackPlugin = require("clean-webpack-plugin")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const Dotenv = require("dotenv-webpack")

const ENV = process.env.NODE_ENV || "development"
const isProd = ENV !== "development"
const output = "public"

module.exports = {
  mode: ENV,
  entry: ["./src/index.tsx"],
  output: {
    filename: "[name].[hash].js",
    chunkFilename: "[id].[hash].js",
    publicPath: "/",
    path: path.resolve(__dirname, output)
  },
  optimization: {
    splitChunks: {
      name: "vendor",
      chunks: "initial"
    }
  },
  plugins: [
    new CleanWebpackPlugin(),
    new Dotenv(),
    new HtmlWebpackPlugin({
      template: "src/index.html",
      filename: "index.html"
    }),
    // 型エラーのみを検知する
    new ForkTsCheckerWebpackPlugin({ checkSyntacticErrors: true })
  ],
  module: {
    rules: [
      {
        test: /\.*(ts|tsx)$/,
        exclude: /node_modules/,
        use: [].concat(
          isProd
            ? [
                {
                  loader: "babel-loader"
                },
                {
                  loader: "ts-loader",
                  options: {
                    // 型を無視する
                    happyPackMode: true
                  }
                }
              ]
            : [
                {
                  // webpackをマルチスレッド化
                  loader: "thread-loader",
                  options: {
                    workers: require("os").cpus().length - 1,
                    poolTimeout: Infinity
                  }
                },
                {
                  loader: "babel-loader"
                },
                {
                  loader: "ts-loader",
                  options: {
                    // 型を無視する
                    happyPackMode: true
                  }
                }
              ]
        )
      }
    ]
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx", ".css"]
  },
  devServer: {
    historyApiFallback: true,
    contentBase: "public",
    open: true
  }
}
