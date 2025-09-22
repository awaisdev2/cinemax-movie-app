module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { 
        jsxImportSource: "nativewind",
        jsxRuntime: "automatic"
      }],
      "@babel/preset-typescript",
      "nativewind/babel"
    ],
    plugins: [
      ["babel-plugin-module-resolver", {
        "root": ["./"],
        "alias": {
          "@": "./"
        }
      }],
      "react-native-reanimated/plugin"
    ]
  };
};
