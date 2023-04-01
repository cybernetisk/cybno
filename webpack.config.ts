import MiniCssExtractPlugin from "mini-css-extract-plugin"
import * as path from "path"
import * as webpack from "webpack"
import "webpack-dev-server"

const production = process.env.NODE_ENV === "production"

const STYLE_LOADER = production ? MiniCssExtractPlugin.loader : "style-loader"

const config: webpack.Configuration = {
  mode: production ? "production" : "development",
  entry: ["./src/index.tsx"],
  output: {
    path: path.resolve(__dirname, "public/build/"),
    publicPath: "build/",
    filename: "bundle.js",
  },
  devServer: {
    static: {
      directory: "./public",
    },
    hot: true,
    port: 3000,
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [STYLE_LOADER, "css-loader"],
      },
      {
        test: /\.scss$/,
        use: [
          STYLE_LOADER,
          {
            loader: "css-loader",
            options: {
              url: false,
            },
          },
          "sass-loader",
        ],
      },
    ],
  },
  plugins: [new MiniCssExtractPlugin()],
  optimization: {},
}

export default config
