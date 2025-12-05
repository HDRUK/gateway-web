const createNextIntlPlugin = require("next-intl/plugin");
const withNextIntl = createNextIntlPlugin();

const allowAllHeader = [
    { key: "Access-Control-Allow-Credentials", value: "true" },
    { key: "Access-Control-Allow-Origin", value: "*" },
    { key: "Access-Control-Allow-Methods", value: "GET" },
    {
        key: "Access-Control-Allow-Headers",
        value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
    },
];

const nextConfig = {
    reactStrictMode: true,
    env: {
        API_V1_URL: process.env.NEXT_PUBLIC_API_V1_URL,
        API_V1_IP_URL: process.env.NEXT_PUBLIC_API_V1_IP_URL,
        API_VERSION: process.env.NEXT_PUBLIC_API_VERSION,
    },
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "*.hdruk.cloud",
                pathname: "/**",
            },
            {
                protocol: "http",
                hostname: "*.hdruk.cloud",
                pathname: "/**",
            },
            {
                protocol: "https",
                hostname: "storage.googleapis.com",
                pathname: "/hdr-gw-wordpress-dev/**",
            },
            {
                protocol: "https",
                hostname: "storage.googleapis.com",
                pathname: "/hdr-gw-wordpress-preprod/**",
            },
            {
                protocol: "https",
                hostname: "storage.googleapis.com",
                pathname: "/hdr-gw-wordpress-prod/**",
            },
        ],
    },
    async headers() {
        return [
            {
                source: "/(.*)",
                headers: [
                    {
                        key: "Strict-Transport-Security",
                        value: "max-age=63072000; includeSubDomains; preload",
                    },
                ],
            },
            {
                source: "/api/widget/:path*",
                headers: allowAllHeader,
            },
            {
                source: "/embed/widget.js",
                headers: allowAllHeader,
            },
        ];
    },
    async rewrites() {
        return [
            {
                source: "/robots.txt",
                destination: "/api/robots",
            },
        ];
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
};

module.exports = withNextIntl(nextConfig);
