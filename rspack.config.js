const path = require('path');
const { HtmlRspackPlugin } = require('@rspack/core');

/**
 * @type {import('@rspack/cli').Configuration}
 */
module.exports = {
  context: __dirname,
  entry: "./src/index.tsx",
  output: {
    clean: true,
    path: path.resolve(__dirname, "dist"),
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: "builtin:swc-loader",
          options: {
            sourceMap: true,
            jsc: {
              parser: {
                syntax: "typescript",
                tsx: true
              },
              transform: {
                react: {
                  runtime: "automatic"
                }
              }
            }
          }
        },
        type: "javascript/auto"
      }
    ]
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"]
  },
  devServer: {
    port: 3000,
    hot: true,
    historyApiFallback: true
  },
  plugins: [
    new HtmlRspackPlugin({
      title: '字幕文件重命名工具',
      inject: true,
      minify: process.env.NODE_ENV === 'production',
    }),
  ],
  experiments: {
    css: true,
  },
}; 