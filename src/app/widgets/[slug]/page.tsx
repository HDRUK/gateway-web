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
    console.log('hi')
    const widgetsEnabled = await isWidgetsEnabled();
    console.log(widgetsEnabled, 'widgetsEnabled')

    if (!widgetsEnabled) {
        return notFound();
    }

    const { slug } = await params;

    const popped = slug.split("-");
    const teamId = popped[0];
    const widgetId = popped[1];
    const headersList = await headers();
    const referer = headersList.get("referer");
    
    console.log(referer, 'referer')
    console.log(widgetId, 'widgetId')
    console.log(teamId, 'teamId')




    // if (!referer) {
    //     return (
    //         <html lang="en">
    //             <body>
    //                 <>This widget cannot be viewed in a standalone browser, it must be inside the iframe on the permitted domains assigned.</>
    //             </body>
    //         </html>
    //     );
    // }

    const response = await fetch(
        `${apis.apiV1IPUrl}/teams/${teamId}/widgets/${widgetId}/data?domain_origin=${referer}`,
        {
            next: { revalidate: 180, tags: ["all", `widget-${widgetId}`] },
            cache: "force-cache",
        }
    );

    if (!response.ok) {
        console.log(response)
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
