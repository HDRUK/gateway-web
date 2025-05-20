import type { MetadataRoute } from "next";

export const dynamic = "force-dynamic";

const { BLOCK_ROBOTS, NEXT_PUBLIC_GATEWAY_URL } = process.env;
const isBlocked = BLOCK_ROBOTS === "true";

console.log("BLOCK_ROBOTS", BLOCK_ROBOTS);
console.log("isBlocked", isBlocked);

export default function robots(): MetadataRoute.Robots {
    if (isBlocked) {
        console.log("iamhit");
        return {
            rules: {
                userAgent: "*",
                disallow: "/",
            },
            sitemap: "",
        };
    }
    console.log("iamhit2");
    return {
        rules: {
            userAgent: "*",
            allow: "/",
            disallow: ["/account/", "/sign-in", "/search"],
        },
        sitemap: `${NEXT_PUBLIC_GATEWAY_URL}/sitemap.xml`,
    };
}
