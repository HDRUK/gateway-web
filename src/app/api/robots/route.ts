import { NextResponse } from "next/server";

export const dynamic = "force-dynamic"; // this is key

const { BLOCK_ROBOTS } = process.env;
const { NEXT_PUBLIC_GATEWAY_URL } = process.env;
export async function GET() {
    const isBlocked = BLOCK_ROBOTS === "true";

    const body = isBlocked
        ? ["User-agent: *", "Disallow: /", "Sitemap:"].join("\n")
        : [
              "User-agent: *",
              "Allow: /",
              "Disallow: /accountssssssss/",
              "Disallow: /sign-in",
              "Disallow: /search",
              `Sitemap: ${NEXT_PUBLIC_GATEWAY_URL}/sitemapssssssssssssssss.xml`,
          ].join("\n");

    return new NextResponse(body, {
        headers: {
            "Content-Type": "text/plain",
        },
    });
}
