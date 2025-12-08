import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import apis from "@/config/apis";

export const revalidate = 180;

const reactUrl = "https://esm.sh/react@18";
const reactDomUrl = "https://esm.sh/react-dom@18/client";
const widget = "embed/widget.js";
const { NEXT_PUBLIC_GATEWAY_URL } = process.env;

export async function GET(req: NextRequest, { params }) {
    try {
        const widgetUrl = `${
            new URL(NEXT_PUBLIC_GATEWAY_URL!).origin
        }/${widget}`;

        const { slug } = await params;

        if (!slug || !slug.includes("-")) {
            return NextResponse.json(
                { error: "Invalid slug format. Expected 'teamId-widgetId'." },
                { status: 400 }
            );
        }

        const [teamId, widgetId] = slug.split("-");

        if (!teamId || !widgetId) {
            return NextResponse.json(
                { error: "Missing teamId or widgetId in slug." },
                { status: 400 }
            );
        }

        const headersList = await headers();
        const referer = headersList.get("referer");

        const { origin } = new URL(referer!);

        const response = await fetch(
            `${apis.apiV1IPUrl}/teams/${teamId}/widgets/${widgetId}/data?domain_origin=${origin}`,
            {
                next: { revalidate: 180, tags: ["all", `widget-${widgetId}`] },
                cache: "force-cache",
            }
        );

        if (!response.ok) {
            const text = await response.text();
            return NextResponse.json(
                {
                    error: "Failed to fetch widget data from API.",
                    status: response.status,
                    message: text,
                },
                { status: response.status }
            );
        }

        const { data } = await response.json();

        const script = `
      import React from "${reactUrl}";
      import ReactDOM from "${reactDomUrl}";
      import Widget from "${widgetUrl}";

      const el = document.getElementById("HDRGatewayWidget");
      const root = ReactDOM.createRoot(el);
      root.render(React.createElement(Widget, { data: ${JSON.stringify(
          data
      )} }));
    `;
        return new NextResponse(script, {
            headers: {
                "Content-Type": "application/javascript",
                "Cache-Control":
                    "public, max-age=180, s-maxage=180, stale-while-revalidate=300",
            },
            status: 200,
        });
    } catch (error) {
        console.error("Widget API route error:", error);
        return NextResponse.json(
            {
                error: "Internal Server Error",
                message: (error as Error).message,
            },
            { status: 500 }
        );
    }
}
