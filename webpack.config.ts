import MiniCssExtractPlugin from "mini-css-extract-plugin"
import * as path from "path"
import * as webpack from "webpack"

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
    static: "./public",
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
  plugins: [],
  optimization: {},
}

if (production) {
  // Split CSS to separate files
  ;(config.plugins as webpack.WebpackPluginInstance[]).push(
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: "main.css",
      chunkFilename: "main.css",
    }),
  )
}

export default config
