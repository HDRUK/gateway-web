import { headers } from "next/headers";
import { notFound } from "next/navigation";
import ThemeRegistry from "@/components/ThemeRegistry/ThemeRegistry";
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

    const response = await fetch(
        `${apis.apiV1IPUrl}/teams/${teamId}/widgets/${widgetId}/data?domain_origin=${referer}`,
        {
            next: { revalidate: 180, tags: ["all", `widget-${widgetId}`] },
            cache: "force-cache",
        }
    );

    if (!response.ok) {
        notFound();
    }
    const { data } = await response.json();

    return (
        <html lang="en">
            <body>
                <ThemeRegistry isIframe>
                    <WidgetDisplay data={data} isIframe />
                </ThemeRegistry>
            </body>
        </html>
    );
}
