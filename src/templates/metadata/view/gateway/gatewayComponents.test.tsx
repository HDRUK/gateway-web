import { useRouter } from "next/navigation";
import MetadataView, { JSONSchemaDocument } from "@/modules/MetadataView";
import { fireEvent, render, screen, within } from "@/utils/testUtils";
import { gatewayComponents, makeGatewayComponents } from "./gatewayComponents";

jest.mock("next/navigation", () => ({
    useRouter: jest.fn(),
    usePathname: jest.fn(),
    useSearchParams: jest.fn(),
}));

// Record what the Gateway Table is handed rather than depend on its markup.
jest.mock("@/components/Table", () => ({
    __esModule: true,
    default: ({ rows, columns }: { rows: unknown[]; columns: unknown[] }) => (
        <div
            data-testid="gateway-table"
            data-rows={rows.length}
            data-columns={columns.length}
        />
    ),
}));

const schema: JSONSchemaDocument = {
    properties: {
        summary: {
            type: "object",
            title: "Summary",
            properties: {
                keywords: { type: "string", title: "Keywords" },
                datasetAliases: {
                    type: "array",
                    title: "Aliases",
                    items: { type: "string" },
                },
                doiName: { type: "string", title: "DOI" },
                description: { type: "string", title: "Description" },
            },
        },
        accessibility: {
            type: "object",
            title: "Accessibility",
            properties: {
                formats: {
                    type: "array",
                    title: "Formats",
                    items: { type: "string" },
                },
                usage: {
                    type: "object",
                    properties: {
                        duoCodes: {
                            type: "array",
                            title: "DUO codes",
                            items: { type: "string" },
                        },
                    },
                },
            },
        },
        coverage: {
            type: "object",
            title: "Coverage",
            properties: {
                followUp: { type: "string", title: "Follow-up" },
            },
        },
        required: {
            type: "object",
            title: "Required",
            properties: {
                issued: {
                    type: "string",
                    format: "date-time",
                    title: "Issued",
                },
            },
        },
        projectGrants: {
            type: "array",
            title: "Grants",
            items: {
                type: "object",
                properties: {
                    pid: { type: "string", title: "PID" },
                    grantNumber: { type: "string", title: "Grant number" },
                },
            },
        },
    },
};

const renderView = (data: Record<string, unknown>) =>
    render(
        <MetadataView
            data={data}
            schema={schema}
            components={gatewayComponents}
        />
    );

describe("gatewayComponents", () => {
    const push = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        (useRouter as jest.Mock).mockReturnValue({ push });
    });

    describe("search tags (production LIST_TAG)", () => {
        it("renders comma-separated keywords as search buttons", () => {
            renderView({ summary: { keywords: "Cancer,HPV" } });

            const button = screen.getByRole("button", { name: "Cancer" });
            expect(
                screen.getByRole("button", { name: "HPV" })
            ).toBeInTheDocument();

            fireEvent.click(button);
            expect(push).toHaveBeenCalledWith(
                "/search?type=datasets&query=Cancer"
            );
        });

        it("also splits GWDM's ;,; delimited keywords", () => {
            renderView({ summary: { keywords: "One;,;Two;,;Three" } });

            expect(screen.getAllByRole("button")).toHaveLength(3);
        });

        it("renders dataset aliases as search buttons", () => {
            renderView({ summary: { datasetAliases: ["Alias A", "Alias B"] } });

            expect(
                screen.getByRole("button", { name: "Alias A" })
            ).toBeInTheDocument();
        });

        it("keeps a single keyword a search button", () => {
            renderView({ summary: { keywords: "Genomics" } });

            expect(
                screen.getByRole("button", { name: "Genomics" })
            ).toBeInTheDocument();
        });
    });

    it("renders any other list as comma-separated text (production LIST_TEXT)", () => {
        const { container } = renderView({
            accessibility: { formats: ["CSV", "JSON"] },
        });

        // Each item is its own span, exactly as production's formatTextWithLinks.
        expect(container).toHaveTextContent("CSV, JSON");
        expect(screen.queryByRole("button")).not.toBeInTheDocument();
    });

    it("renders text through sanitised markdown, so lists survive", () => {
        const { container } = renderView({
            summary: { description: "Includes:\n\n- Papers\n- Preprints" },
        });

        expect(container.querySelectorAll("li")).toHaveLength(2);
    });

    it("links a bare DOI name to doi.org", () => {
        renderView({ summary: { doiName: "10.1234/example.1" } });

        expect(
            screen.getByRole("link", {
                name: "https://doi.org/10.1234/example.1",
            })
        ).toHaveAttribute("href", "https://doi.org/10.1234/example.1");
    });

    it("keeps a follow-up's '>' as text rather than a blockquote", () => {
        const { container } = renderView({
            coverage: { followUp: "> 10 YEARS" },
        });

        expect(container.querySelector("blockquote")).toBeNull();
        expect(container).toHaveTextContent(">");
    });

    it("formats dates as DD/MM/YYYY", () => {
        renderView({ required: { issued: "2020-08-05T14:35:59Z" } });

        expect(screen.getByText("05/08/2020")).toBeInTheDocument();
    });

    it("renders tables with the Gateway Table component", () => {
        renderView({
            projectGrants: [
                { pid: "P1", grantNumber: "G1" },
                { pid: "P2", grantNumber: "G2" },
            ],
        });

        const table = screen.getByTestId("gateway-table");
        expect(table).toHaveAttribute("data-rows", "2");
        expect(table).toHaveAttribute("data-columns", "2");
    });

    it("leaves sections unwrapped so the page supplies one card for all of them", () => {
        const { container } = renderView({
            summary: { doiName: "10.1/a" },
            coverage: { followUp: "1 YEAR" },
        });

        expect(container.querySelector(".MuiPaper-root")).toBeNull();
        expect(within(container).getByText("Summary")).toBeInTheDocument();
        expect(within(container).getByText("Coverage")).toBeInTheDocument();
    });

    it("renders DUO codes as the production DUO chips, labelled from the HDRUK schema", () => {
        render(
            <MetadataView
                data={{
                    accessibility: {
                        usage: { duoCodes: ["DUO:0000042", "DUO:9999999"] },
                    },
                }}
                schema={schema}
                components={makeGatewayComponents({
                    duoCodeDetails: {
                        "DUO:0000042": {
                            shortcode: "GRU",
                            label: "General research use",
                            description: "General research.",
                        },
                    },
                })}
            />
        );

        expect(screen.getByText("GRU")).toBeInTheDocument();
        expect(screen.getByText("DUO:9999999")).toBeInTheDocument();
        expect(
            screen.queryByText("DUO:0000042, DUO:9999999")
        ).not.toBeInTheDocument();
    });
});
