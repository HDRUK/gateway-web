// import { headers } from "next/headers";
import apis from "@/config/apis";
import WidgetDisplay from "./components/WidgetDisplay";

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

    // const headersList = headers();
    // const referer = headersList.get("referer");

    const { origin } = new URL("http://www.google.com/test"); // referer);

    const response = await fetch(
        `${apis.apiV1IPUrl}/teams/${teamId}/widgets/${widgetId}/data?domain_origin=${origin}`
    );
    const data = await response.json();

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
