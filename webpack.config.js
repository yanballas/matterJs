const TerserPlugin = require("terser-webpack-plugin");

const config = {
  mode: 'production',
  entry: {
    index: './src/main.js'
  },
  output: {
    filename: 'main.js'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      }
    ],
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          format: {
            comments: false,
          },
        },
        extractComments: false,
      }),
    ],
  },
};

module.exports = config;