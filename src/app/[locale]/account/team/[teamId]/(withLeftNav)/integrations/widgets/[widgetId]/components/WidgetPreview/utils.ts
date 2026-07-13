import { WidgetEntityData } from "@/interfaces/Widget";

interface GenerateWidgetCodeProps {
    data?: WidgetEntityData;
    teamId?: string;
    widgetId?: number;
    gatewayUrl: string;
}

export const generateWidgetCode = ({
    data,
    teamId,
    widgetId,
    gatewayUrl,
}: GenerateWidgetCodeProps) => {
    if (!data) {
        return "";
    }

    return `<div style="position: relative; width: ${data.widget.size_width}${data.widget.unit}; height: ${data.widget.size_height}${data.widget.unit}; max-width: 100%;"><iframe title="HDR Gateway Widget" src="${gatewayUrl}/widgets/${teamId}-${widgetId}" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0;" allowfullscreen="true"></iframe></div>`;
};

export const generateCspDirective = (gatewayUrl: string) =>
    `frame-src 'self' ${new URL(gatewayUrl).host};`;
