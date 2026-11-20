/** @type {import("next/dist/shared/lib/image-config").RemotePattern[]} */
const remoteImagePatterns = [
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
    ...(process.env.NODE_ENV === "development"
        ? [
              {
                  protocol: "http",
                  hostname: "localhost",
                  pathname: "/**",
              },
          ]
        : []),
];

module.exports = remoteImagePatterns;
