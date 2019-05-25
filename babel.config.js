module.exports = function(api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo", "module:react-native-dotenv"],
    plugins: [
      [
        "module-resolver",
        {
          root: ["./"],
          alias: {
            "@components": "./src/components",
            "@screens": "./src/screens",
            "@theme": "./src/theme",
            "@constants": "./src/constants",
            "@utils": "./src/utils",
            "@assets": "./assets"
          }
        }
      ]
    ]
  };
};
