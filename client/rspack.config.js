/**
 * @type {import('@rspack/cli').Configuration}
 */
module.exports = {
  context: __dirname,
  entry: {
    main: "./src/main.tsx",
  },
  mode: "development",
  output: {
    path: "./dist",
    filename: "[name].[contenthash].js",
  },
  builtins: {
    html: [
      {
        template: "./index.html",
      },
    ],
    minifyOptions: {
      dropConsole: true,
      passes: 2,
    },
  },
  optimization: {
    splitChunks: {
      chunks: "all",
      minSize: 70 * 1024,
    },
  },
  module: {
    rules: [
      {
        test: /\.svg$/,
        type: "asset",
      },
      {
        test: /\.[jt]sx?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  devServer: {
    historyApiFallback: true,
    port: 3000,
    hot: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization",
    },
  },
};
