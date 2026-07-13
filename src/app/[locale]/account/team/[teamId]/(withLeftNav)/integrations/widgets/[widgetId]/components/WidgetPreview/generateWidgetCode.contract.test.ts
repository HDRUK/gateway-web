import { Unit, WidgetEntityData } from "@/interfaces/Widget";
import { generateCspDirective, generateWidgetCode } from "./utils";

const GATEWAY_URL = "https://web.example.hdruk.cloud";

const data: WidgetEntityData = {
    datasets: [],
    data_uses: [],
    scripts: [],
    collections: [],
    widget: {
        widget_name: "Contract widget",
        size_width: 400,
        size_height: 592,
        unit: Unit.PX,
        include_search_bar: 1,
        include_cohort_link: 1,
        keep_proportions: 0,
    },
};

describe("Widget embed contract: generateWidgetCode", () => {
    const code = generateWidgetCode({
        data,
        teamId: "21",
        widgetId: 7,
        gatewayUrl: GATEWAY_URL,
    });

    it("produces the exact snippet third parties paste into their sites", () => {
        expect(code).toMatchInlineSnapshot(
            `"<div style="position: relative; width: 400px; height: 592px; max-width: 100%;"><iframe title="HDR Gateway Widget" src="https://web.example.hdruk.cloud/widgets/21-7" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0;" allowfullscreen="true"></iframe></div>"`
        );
    });

    it("points the iframe at /widgets/{teamId}-{widgetId}", () => {
        expect(code).toContain(`src="${GATEWAY_URL}/widgets/21-7"`);
    });

    it("keeps the iframe full-screen capable and responsive", () => {
        expect(code).toContain(`allowfullscreen="true"`);
        expect(code).toContain("max-width: 100%;");
    });

    it("returns an empty string until widget data has loaded", () => {
        expect(
            generateWidgetCode({
                data: undefined,
                teamId: "21",
                widgetId: 7,
                gatewayUrl: GATEWAY_URL,
            })
        ).toBe("");
    });
});

describe("Widget embed contract: CSP guidance", () => {
    it("produces the exact frame-src directive embedders add to their CSP", () => {
        expect(generateCspDirective(GATEWAY_URL)).toBe(
            "frame-src 'self' web.example.hdruk.cloud;"
        );
    });
});
