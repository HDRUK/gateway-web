import type { MetadataRoute } from "next";

const { BLOCK_ROBOTS, NEXT_PUBLIC_GATEWAY_URL } = process.env;
const isBlocked = BLOCK_ROBOTS === "true";

export default function robots(): MetadataRoute.Robots {
    if (isBlocked) {
        return {
            rules: {
                userAgent: "*",
                disallow: "/",
            },
            sitemap: "",
        };
    }

    return {
        rules: {
            userAgent: "*",
            allow: "/",
            disallow: ["/account/", "/sign-in", "/search"],
        },
        sitemap: `${NEXT_PUBLIC_GATEWAY_URL}/sitemap.xml`,
    };
}
