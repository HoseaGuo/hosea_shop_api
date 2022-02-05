const path = require("path");

module.exports = {
  mode: "production",
  target: "node",
  entry: "./src/app.ts",
  // devtool: "inline-source-map",
  output: {
    path: __dirname + "/dist",
    filename: "app.js",
    clean: true, // 在生成文件之前清空 output 目录
  },
  // externals: _externals(),
  resolve: {
    // Add ".ts" and ".tsx" as resolvable extensions.
    extensions: [".ts", ".tsx", ".js"],
  },
  module: {
    rules: [
      // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
      {
        test: /\.tsx?$/,
        use: {
          loader: "ts-loader",
          options: {
            transpileOnly: true,
          },
        },
        exclude: "/node_modules/", //排除  node_modules中的内容
      },
      {
        /* 打包的时候，将process.env.KEY替换成对应的值 */
        include: path.resolve(__dirname, "config.ts"),
        loader: "string-replace-loader",
        options: {
          search: /process\.env\.KEY/i,
          replace: `"${process.env.KEY}"`,
        },
      },
    ],
  },
};

function _externals() {
  let manifest = require("./package.json");
  let dependencies = manifest.dependencies;
  let externals = {};
  for (let p in dependencies) {
    externals[p] = "commonjs " + p;
  }
  return externals;
}
