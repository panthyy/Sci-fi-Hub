module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["@babel/preset-env", { targets: { node: "current" } }],
      ["@babel/preset-react", { runtime: "automatic" }],
      "@emotion/babel-preset-css-prop",
      "@babel/preset-typescript",
    ],
    plugins: [
      "babel-plugin-twin",
      "babel-plugin-macros",
      [
        require.resolve("babel-plugin-module-resolver"),
        {
          root: ["./src/"],
          extensions: [".js", ".jsx", ".ts", ".tsx"],
          alias: {
            "@components": "./src/components",
            "@hooks": "./src/hooks",
            "@utils": "./src/utils",
          },
        },
      ],
    ],
  };
};
