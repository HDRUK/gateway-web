import { WidgetEntityData } from "@/interfaces/Widget";
import { CodeFormat } from "../../const";

interface GenerateWidgetCodeProps {
    data?: WidgetEntityData;
    teamId?: string;
    widgetId?: number;
    gatewayUrl: string;
    format?: CodeFormat;
}

interface SnippetValues {
    width: string;
    height: string;
    src: string;
}

const snippets: Record<CodeFormat, (values: SnippetValues) => string> = {
    [CodeFormat.HTML]: ({ width, height, src }) =>
        `<div style="position: relative; width: ${width}; height: ${height}; max-width: 100%;"><iframe title="HDR Gateway Widget" src="${src}" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0;" allowfullscreen="true"></iframe></div>`,
    [CodeFormat.REACT]: ({ width, height, src }) =>
        `<div style={{ position: "relative", width: "${width}", height: "${height}", maxWidth: "100%" }}><iframe title="HDR Gateway Widget" src="${src}" style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: 0 }} allowFullScreen /></div>`,
};

export const generateWidgetCode = ({
    data,
    teamId,
    widgetId,
    gatewayUrl,
    format = CodeFormat.HTML,
}: GenerateWidgetCodeProps) => {
    if (!data) {
        return "";
    }

    const { size_width, size_height, unit } = data.widget;

    return snippets[format]({
        width: `${size_width}${unit}`,
        height: `${size_height}${unit}`,
        src: `${gatewayUrl}/widgets/${teamId}-${widgetId}`,
    });
};

export const generateCspDirective = (gatewayUrl: string) =>
    `frame-src 'self' ${new URL(gatewayUrl).host};`;
