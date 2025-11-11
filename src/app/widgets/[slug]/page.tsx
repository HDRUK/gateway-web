// import { headers } from "next/headers";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import apis from "@/config/apis";
import WidgetDisplay from "@/widgets/WidgetDisplay";

interface WidgetProps {
    params: {
        slug: string;
    };
}

export default async function Widget({ params }: WidgetProps) {
    const { slug } = params;

    const popped = slug.split("-");
    const teamId = popped[0];
    const widgetId = popped[1];
    const headersList = headers();
    const referer = headersList.get("referer");
    const origins = headersList.get("origin");
    console.log('<<<<', referer)
    console.log('<<<<', origins)
    // const { origin } = new URL(referer!);
    const origin = "https://www.google.com";
    const response = await fetch(
        `${apis.apiV1IPUrl}/teams/${teamId}/widgets/${widgetId}/data?domain_origin=${origin}`,
        {
            next: { revalidate: 180, tags: ["all", `widget-${widgetId}`] },
            cache: "force-cache",
        }
    );
    console.log(
        `${apis.apiV1IPUrl}/teams/${teamId}/widgets/${widgetId}/data?domain_origin=${origin}`
    );
    if (!response.ok) {
        notFound();
    }
    const { data } = await response.json();

    return (
        <html lang="en">
            <head>
                <meta charSet="utf-8" />
                <meta
                    name="viewport"
                    content="width=device-width,initial-scale=1"
                />
            </head>
            <body style={{ margin: 0 }}>
                <WidgetDisplay data={data} />
            </body>
        </html>
    );
}
