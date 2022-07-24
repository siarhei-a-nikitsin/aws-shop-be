const { IgnorePlugin } = require("webpack");

module.exports = {
  target: "node",
  mode: "development",
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [["@babel/preset-env"]],
          },
        },
      },
    ],
  },
  plugins: [
    new IgnorePlugin({
      resourceRegExp: /^pg-native$/,
    }),
  ],
};
