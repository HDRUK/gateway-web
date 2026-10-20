import { render, screen, within } from "@/utils/testUtils";
import MetadataView from "./MetadataView";
import { JSONSchemaDocument } from "./types";

const schema: JSONSchemaDocument = {
    $defs: {
        Origin: {
            type: "object",
            title: "Origin",
            properties: {
                purpose: { type: "string", title: "Purpose of collection" },
            },
        },
        CreativeWork: {
            type: "object",
            title: "CreativeWork",
            properties: { name: { type: "string", title: "Name" } },
        },
        Column: {
            type: "object",
            properties: {
                name: { type: "string", title: "Column" },
                sensitive: { type: "boolean", title: "Sensitive" },
                values: { type: "array", items: { type: "object" } },
            },
        },
    },
    properties: {
        identifier: { type: "string", title: "Identifier" },
        provenance: {
            type: "object",
            title: "Provenance",
            properties: {
                origin: { allOf: [{ $ref: "#/$defs/Origin" }] },
            },
        },
        summary: {
            type: "object",
            title: "Summary",
            properties: {
                keywords: { type: "string", title: "Keywords" },
            },
        },
        columns: {
            type: "array",
            title: "Columns",
            items: { $ref: "#/$defs/Column" },
        },
        isAccessibleForFree: {
            type: "boolean",
            title: "Is Accessible For Free?",
        },
        license: {
            title: "License",
            anyOf: [
                { $ref: "#/$defs/CreativeWork" },
                { type: "string", format: "uri" },
                { type: "null" },
            ],
        },
    },
};

describe("MetadataView", () => {
    it("gives every renderer the full path of the value it renders", () => {
        // Lets a consumer special-case a field (e.g. link keywords to search)
        // without the module itself knowing any field names.
        const seen: string[] = [];
        const Text = ({ path, value }: { path?: string; value: unknown }) => {
            seen.push(`${path}=${String(value)}`);
            return null;
        };

        render(
            <MetadataView
                data={{
                    identifier: "02",
                    provenance: { origin: { purpose: "Care" } },
                }}
                schema={schema}
                components={{ text: Text }}
            />
        );

        expect(seen).toEqual(
            expect.arrayContaining([
                "identifier=02",
                "provenance.origin.purpose=Care",
            ])
        );
    });

    it("prefixes the path with `path` when scoped to a node", () => {
        const seen: string[] = [];
        const Text = ({ path }: { path?: string }) => {
            seen.push(path ?? "");
            return null;
        };

        render(
            <MetadataView
                data={{ provenance: { origin: { purpose: "Care" } } }}
                schema={schema}
                path="provenance"
                components={{ text: Text }}
            />
        );

        expect(seen).toEqual(["provenance.origin.purpose"]);
    });

    it("flattens a nested object to one label/value row per leaf", () => {
        render(
            <MetadataView
                data={{ provenance: { origin: { purpose: "Care" } } }}
                schema={schema}
            />
        );

        expect(screen.getByText("Purpose of collection")).toBeInTheDocument();
        expect(screen.getByText("Care")).toBeInTheDocument();
        expect(screen.queryByText("Origin")).not.toBeInTheDocument();
    });

    it("renders a ;,; delimited string as chips", () => {
        render(
            <MetadataView
                data={{ summary: { keywords: "Primary care;,;GP" } }}
                schema={schema}
            />
        );

        expect(screen.getByText("Primary care")).toBeInTheDocument();
        expect(screen.getByText("GP")).toBeInTheDocument();
    });

    it("renders an array of flat objects as a table, keeping false booleans", () => {
        render(
            <MetadataView
                data={{
                    columns: [
                        { name: "patient_id", sensitive: true },
                        { name: "postcode", sensitive: false },
                    ],
                }}
                schema={schema}
            />
        );

        const table = screen.getByRole("table");
        expect(within(table).getByText("Column")).toBeInTheDocument();
        expect(within(table).getByText("Yes")).toBeInTheDocument();
        expect(within(table).getByText("No")).toBeInTheDocument();
    });

    it("drops a column that is empty in every row", () => {
        render(
            <MetadataView
                data={{ columns: [{ name: "patient_id" }] }}
                schema={schema}
            />
        );

        expect(screen.queryByText("Sensitive")).not.toBeInTheDocument();
    });

    it("renders a path-scoped node as one titled section of rows", () => {
        render(
            <MetadataView
                data={{ summary: { keywords: "Primary care;,;GP" } }}
                schema={schema}
                path="summary"
            />
        );

        expect(
            screen.getByRole("heading", { name: "Summary" })
        ).toBeInTheDocument();
        expect(
            screen.queryByRole("heading", { name: "Keywords" })
        ).not.toBeInTheDocument();
        expect(screen.getByText("Keywords")).toBeInTheDocument();
    });

    it("drops a field named in `exclude` under a path", () => {
        render(
            <MetadataView
                data={{ summary: { keywords: "GP" } }}
                schema={schema}
                path="summary"
                exclude={["keywords"]}
            />
        );

        expect(screen.queryByText("Keywords")).not.toBeInTheDocument();
    });

    it("renders a scalar section as a row rather than a heading", () => {
        render(<MetadataView data={{ identifier: "02" }} schema={schema} />);

        expect(
            screen.queryByRole("heading", { name: "Identifier" })
        ).not.toBeInTheDocument();
        expect(screen.getByText("Identifier")).toBeInTheDocument();
        expect(screen.getByText("02")).toBeInTheDocument();
    });

    it("keeps the heading for a section holding a container", () => {
        render(
            <MetadataView
                data={{ provenance: { origin: { purpose: "Care" } } }}
                schema={schema}
            />
        );

        expect(
            screen.getByRole("heading", { name: "Provenance" })
        ).toBeInTheDocument();
    });

    it("gives a block section a stable anchor id", () => {
        const { container } = render(
            <MetadataView
                data={{ provenance: { origin: { purpose: "Care" } } }}
                schema={schema}
            />
        );

        expect(container.querySelector("#section-provenance")).not.toBeNull();
    });

    it("gives a section that renders as a single row an anchor too", () => {
        // A section collapsing to one row (a scalar, a short list, a
        // one-column table) still has to be reachable from the section nav.
        const { container } = render(
            <MetadataView data={{ identifier: "02" }} schema={schema} />
        );

        expect(container.querySelector("#section-identifier")).not.toBeNull();
    });

    it("renders a false boolean rather than dropping it", () => {
        render(
            <MetadataView
                data={{ isAccessibleForFree: false }}
                schema={schema}
            />
        );

        expect(screen.getByText("Is Accessible For Free?")).toBeInTheDocument();
        expect(screen.getByText("No")).toBeInTheDocument();
    });

    it("picks the anyOf branch matching the data", () => {
        render(
            <MetadataView
                data={{ license: "https://example.com/licence" }}
                schema={schema}
            />
        );

        expect(
            screen.getByRole("link", { name: "https://example.com/licence" })
        ).toBeInTheDocument();
    });

    it("drops a section whose rows resolve to nothing", () => {
        const { container } = render(
            <MetadataView
                data={{ provenance: { origin: {} } }}
                schema={schema}
            />
        );

        expect(container.querySelector("h2")).toBeNull();
    });

    it("gives a section heading its own size, with no tooltip inside it", () => {
        const { container } = render(
            <MetadataView
                data={{ provenance: { origin: { purpose: "Care" } } }}
                schema={schema}
            />
        );

        const heading = container.querySelector("h2");
        expect(heading).toHaveTextContent("Provenance");
        // TooltipText nests a body2 <p>, which would override the heading size
        expect(heading?.querySelector("p")).toBeNull();
    });

    it("collapses a single-column table to a list", () => {
        const { container } = render(
            <MetadataView
                data={{
                    columns: [{ name: "patient_id" }, { name: "postcode" }],
                }}
                schema={schema}
            />
        );

        expect(container.querySelector("table")).toBeNull();
        expect(screen.getByText("patient_id")).toBeInTheDocument();
        expect(screen.getByText("postcode")).toBeInTheDocument();
    });

    it("omits excluded fields", () => {
        render(
            <MetadataView
                data={{ summary: { keywords: "GP" } }}
                schema={schema}
                exclude={["summary"]}
            />
        );

        expect(screen.queryByText("Summary")).not.toBeInTheDocument();
    });
});
