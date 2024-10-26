const {TsconfigPathsPlugin} = require("tsconfig-paths-webpack-plugin");

module.exports = function override(config/*, env*/) {
    config.resolve.plugins.push(new TsconfigPathsPlugin());

    config.module.rules[1].oneOf.splice(0, 0, {
        test: /\.svg$/,
        use: ["@svgr/webpack"],
    });

    /*
    console.log(`
WEBPACK CONFIG
==============
${JSON.stringify(config, null, 2)}
==================
END WEBPACK CONFIG`
    );
    */

    return config;
}
