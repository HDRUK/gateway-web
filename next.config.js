const withNextIntl = require("next-intl/plugin")();

/** @type {import('next').NextConfig} */

const nextConfig = withNextIntl({
    reactStrictMode: true,
    swcMinify: true,
    env: {
        API_V1_URL: process.env.NEXT_PUBLIC_API_V1_URL,
        API_V1_IP_URL: process.env.NEXT_PUBLIC_API_V1_IP_URL,
        API_VERSION: process.env.NEXT_PUBLIC_API_VERSION,
    },
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "storage.googleapis.com",
                port: "",
                pathname: "/**",
            },
            {
                protocol: "https",
                hostname: process.env.NEXT_PUBLIC_MEDIA_DOMAIN || "",
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
            {
                source: "/data-custodian/getting-started",
                destination: "/data-custodian/support/getting-started",
                permanent: true,
            },
            {
                source: "/data-custodian/metadata-onboarding",
                destination: "/data-custodian/support/metadata-onboarding",
                permanent: true,
            },
        ];
    },
    typescript: {
        // !! WARN !!
        // Dangerously allow production builds to successfully complete even if
        // your project has type errors.
        // !! WARN !!
        ignoreBuildErrors: true,
    },
});

module.exports = nextConfig;
