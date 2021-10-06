const path = require("path");
const glob = require("glob");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const ImageminPlugin = require("imagemin-webpack-plugin").default;
const SpriteLoaderPlugin = require("svg-sprite-loader/plugin");

module.exports = {
  entry: {
    main: "./src/index.js",
    sprite: glob.sync("./src/assets/images/svg/**/*.svg"),
  },
  output: {
    filename: `assets/js/[name].[hash].js`,
    path: path.resolve(__dirname, "build"),
  },
  // optimization: {
  //   splitChunks: {
  //     cacheGroups: {
  //       vendor: {
  //         name: "vendors",
  //         test: /node_modules/,
  //         chunks: "all",
  //         enforce: true,
  //       },
  //     },
  //   },
  // },
  module: {
    rules: [
      {
        test: /\.pug$/,
        use: ["pug-loader"],
      },
      {
        test: /\.css$/,
        use: [
          "style-loader",
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: { sourceMap: true },
          },
          {
            loader: "postcss-loader",
            options: {
              sourceMap: true,
              config: { path: `./postcss.config.js` },
            },
          },
          {
            loader: "sass-loader",
            options: { sourceMap: true },
          },
        ],
      },
      {
        test: /\.scss$/,
        use: [
          "style-loader",
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: { sourceMap: true },
          },
          {
            loader: "postcss-loader",
            options: {
              sourceMap: true,
              config: { path: `./postcss.config.js` },
            },
          },
          {
            loader: "sass-loader",
            options: { sourceMap: true },
          },
        ],
      },
      {
        test: /\.(png|svg|jpe?g|gif)$/,
        loader: "file-loader",
        exclude: path.resolve(__dirname, "src/assets/images/svg"),
        options: {
          name: "[name].[ext]",
        },
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        loader: "file-loader",
        include: path.resolve(__dirname, "src/assets/fonts"),
        options: {
          name: "[name].[ext]",
        },
      },
      {
        test: /\.svg$/,
        loader: "svg-sprite-loader",
        include: path.resolve(__dirname, "src/assets/images/svg"),
        options: {
          esModule: false,
          extract: true,
        },
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: `assets/css/[name].[hash].css`,
    }),
    new CopyPlugin({
      patterns: [
        { from: `src/assets/images`, to: `assets/images` },
        { from: `src/assets/fonts`, to: `assets/fonts` },
      ],
    }),
    new ImageminPlugin({
      test: /\.(jpe?g|png|gif|svg)$/i,
      jpegtran: { progressive: true },
    }),
    new HtmlWebpackPlugin({
      title: "Main page",
      template: "./src/pug/pages/index.pug",
      // Specify chunks to exclude sprite entry point
      chunks: ["main", "vendors"],
      minify: {
        collapseWhitespace: true,
        removeComments: true,
      },
    }),
    new SpriteLoaderPlugin({ plainSprite: true }),
    // Remove sprite.js file
    {
      apply: (compiler) => {
        compiler.plugin("emit", (compilation, callback) => {
          //Here’s the `compilation` object which represents a single build of assets:
          const { assets } = compilation;
          const chunkToRemove = Object.keys(assets)
            .filter((chunk) => chunk.match(/sprite.*\.js$/))
            .join("");
          delete compilation.assets[chunkToRemove];
          callback();
        });
      },
    },
    // Remove sprite.svg file
    {
      apply: (compiler) => {
        compiler.plugin("emit", (compilation, callback) => {
          const { assets } = compilation;
          const chunkToRemove = Object.keys(assets)
            .filter((chunk) => chunk.match(/sprite.*\.svg$/))
            .join("");
          delete compilation.assets[chunkToRemove];
          callback();
        });
      },
    },
  ],
};
