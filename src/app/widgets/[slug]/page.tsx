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
  const widgetsEnabled = await isWidgetsEnabled();

  if (!widgetsEnabled) {
    return renderError("This feature is temporarily unavailable.");
  }

  const { slug } = await params;
  const [teamId, widgetId] = slug.split("-");


  const headersList = await headers();
  const referer = headersList.get("referer");

  if (!referer) {
    return renderError(
      "This widget cannot be viewed in a browser tab, please view this in the iframe script provided on your website."
    );
  }

  const referrerOrigin = new URL(referer).origin;

  const response = await fetch(
    `${apis.apiV1IPUrl}/teams/${teamId}/widgets/${widgetId}/data?domain_origin=${referrerOrigin}`,
    {
      next: { revalidate: 180, tags: ["all", `widget-${widgetId}`] },
      cache: "force-cache",
    }
  );

  if (!response.ok) {
    if (response.status === 403) {
      return renderError(
        `${referrerOrigin} is not in the list of permitted domains for this widget, please update your widget configuration.`
      );
    }

    return notFound();
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

function renderError(message: string) {
  return (
    <html lang="en">
      <body>
        <ThemeRegistry isIframe>
          {message}
        </ThemeRegistry>
      </body>
    </html>
  );
}
