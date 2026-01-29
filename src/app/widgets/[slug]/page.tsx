import { headers } from "next/headers";
import { notFound } from "next/navigation";
import ThemeRegistry from "@/components/ThemeRegistry/ThemeRegistry";
import apis from "@/config/apis";
import { isWidgetsEnabled } from "@/flags";
import WidgetDisplay from "@/widgets/WidgetDisplay";

interface WidgetProps {
    params: Promise<{
        slug: string;
    }>;
}

export default async function Widget({ params }: WidgetProps) {
    let errorMessage
    const widgetsEnabled = await isWidgetsEnabled();

    if (!widgetsEnabled) {
        errorMessage = 'Widgets are not currently enabled for the HDR Gateway.'
    }

    const { slug } = await params;

    const popped = slug.split("-");
    const teamId = popped[0];
    const widgetId = popped[1];
    const headersList = await headers();
    const referer = headersList.get("referer");
    

     if (!referer) {
       errorMessage = 'This widget cannot be viewed in a browser tab, please view this in the iframe script provided on your website.'
    }

    const referrerOrigin = new URL(referer).origin

    const response = await fetch(
        `${apis.apiV1IPUrl}/teams/${teamId}/widgets/${widgetId}/data?domain_origin=${referrerOrigin}`,
        {
            next: { revalidate: 180, tags: ["all", `widget-${widgetId}`] },
            cache: "force-cache",
        }
    );

    if (!response.ok) {
        if (response.status === 400) {
            errorMessage =  `${referrerOrigin} is not in the list of permitted domains for this widget, please update your widget configuration.`
        } else {
            return notFound();
        }
    }
    const { data } = await response.json();

    return (
        <html lang="en">
            <body>
                <ThemeRegistry isIframe>
                    {errorMessage && <>{errorMessage}</>}
                    {!errorMessage && <WidgetDisplay data={data} isIframe />}
                </ThemeRegistry>
            </body>
        </html>
    );
}
