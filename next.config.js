const { i18n } = require("./next-i18next.config");

/** @type {import('next').NextConfig} */

const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    webpack: (config, context) => {
        if (process.env.NEXT_WEBPACK_USEPOLLING) {
            config.watchOptions = {
                poll: 500,
                aggregateTimeout: 300,
            };
        }
        return config;
    },
    i18n,
};

module.exports = nextConfig;
