const { TsconfigPathsPlugin } = require('tsconfig-paths-webpack-plugin');

module.exports = {
  webpack: function (config /*, env*/) {
    config.resolve.plugins.push(new TsconfigPathsPlugin());

    config.module.rules[1].oneOf.splice(0, 0, {
      test: /\.svg$/,
      use: ['@svgr/webpack'],
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
  },

  devServer: function (configFn) {
    return function (proxy, allowedHost) {
      const config = configFn(proxy, allowedHost);
      return {
        ...config,
        client: {
          ...config.client,
          overlay: {
            errors: true,
            warnings: false,
            runtimeErrors: (error) => {
              // `ApplicationError`s are handled by error boundary
              return error.basename !== 'ApplicationError';
            },
          },
        },
      };
    };
  },
};
