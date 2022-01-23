const path = require('path');
const addRewireScssLoader = require("react-app-rewire-scss-loaders");

function resolve (dir) {
  return path.join(__dirname, '.', dir);
}

module.exports = function override(config, env) {
  config.resolve.alias = {
    ...config.resolve.alias,
    '@': resolve('src')
  };
  config = addRewireScssLoader("sass-resources-loader", {
    resources: [
      path.resolve(__dirname, "src/assets/styles/common", "variables.scss"),
      path.resolve(__dirname, "src/assets/styles/common", "mixins.scss")
    ],
  })(config, env);
  return config;
}