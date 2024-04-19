const withNextIntl = require("next-intl/plugin")();

/** @type {import('next').NextConfig} */

const nextConfig = withNextIntl({
    reactStrictMode: true,
    swcMinify: true,
    env: {
        API_V1_URL: process.env.NEXT_PUBLIC_API_V1_URL,
        API_V1_IP_URL: process.env.NEXT_PUBLIC_API_V1_IP_URL,
    },
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "storage.googleapis.com",
                port: "",
                pathname: "/**",
            },
        ],
    },
    async redirects() {
        return [
            {
                source: "/about/terms-and-conditions",
                destination: "/terms-and-conditions",
                permanent: true,
            },
        ];
    },
    typescript: {
        // !! WARN !!
        // Dangerously allow production builds to successfully complete even if
        // your project has type errors.
        // !! WARN !!
        ignoreBuildErrors: false,
    },
});

module.exports = nextConfig;
