import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import apis from "@/config/apis";

export async function GET(req: NextRequest, { params }) {
    const { slug } = params;

    const popped = slug.split("-");
    const teamId = popped[0];
    const widgetId = popped[1];

    const headersList = headers();
    const referer = headersList.get("referer");

    const { origin } = new URL("http://www.google.com/test"); // referer);

    const response = await fetch(
        `${apis.apiV1IPUrl}/teams/${teamId}/widgets/${widgetId}/data?domain_origin=${origin}`
    );
    const data = await response.json();

    console.log("WIGGY DATA", data);

    const { searchParams } = new URL(req.url);

    const script = `
    import React from "https://esm.sh/react@18";
    import ReactDOM from "https://esm.sh/react-dom@18/client";
    import Widget from "http://localhost:3000/embed/widget.js";

    const el = document.getElementById("replaceMe");

    const root = ReactDOM.createRoot(el);
    root.render(React.createElement(Widget, { data:${JSON.stringify(data)} }));
  `;

    return new NextResponse(script, {
        headers: { "Content-Type": "application/javascript" },
    });
}
