const {TsconfigPathsPlugin} = require("tsconfig-paths-webpack-plugin");

module.exports = {
    "webpack": function(config) {
        config.resolve.plugins.push(new TsconfigPathsPlugin());
        return config;
    }
}
