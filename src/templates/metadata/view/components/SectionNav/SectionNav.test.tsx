import { JSONSchemaDocument } from "@/modules/MetadataView";
import { render, screen } from "@/utils/testUtils";
import SectionNav from "./SectionNav";

const section = (title: string, field: string) => ({
    type: "object",
    title,
    properties: { [field]: { type: "integer" } },
});

const schema: JSONSchemaDocument = {
    properties: {
        summary: section("Summary", "a"),
        coverage: section("Coverage", "b"),
        omics: section("Omics", "c"),
    },
};

describe("SectionNav", () => {
    it("labels each section from the schema, in the declared order", () => {
        render(
            <SectionNav
                sections={["coverage", "summary"]}
                data={{ summary: { a: 1 }, coverage: { b: 2 } }}
                schema={schema}
            />
        );

        const labels = screen
            .getAllByRole("button")
            .map(button => button.textContent);

        expect(labels).toEqual(["Coverage", "Summary"]);
    });

    it("drops a declared section that has no data", () => {
        render(
            <SectionNav
                sections={["summary", "omics"]}
                data={{ summary: { a: 1 } }}
                schema={schema}
            />
        );

        expect(screen.queryByText("Omics")).not.toBeInTheDocument();
    });

    it("drops a section whose nested fields are all empty", () => {
        // The renderer shows no section for an object with nothing renderable
        // inside it, so the nav must not link to it either.
        const nestedSchema: JSONSchemaDocument = {
            properties: {
                ...schema.properties,
                provenance: {
                    type: "object",
                    title: "Provenance",
                    properties: {
                        origin: {
                            type: "object",
                            properties: { purpose: { type: "string" } },
                        },
                    },
                },
            },
        };

        render(
            <SectionNav
                sections={["summary", "provenance"]}
                data={{ summary: { a: 1 }, provenance: { origin: {} } }}
                schema={nestedSchema}
            />
        );

        expect(screen.queryByText("Provenance")).not.toBeInTheDocument();
    });

    it("ignores a name that is not in the schema", () => {
        render(
            <SectionNav
                sections={["summary", "nonsense"]}
                data={{ summary: { a: 1 }, nonsense: { b: 2 } }}
                schema={schema}
            />
        );

        expect(screen.getAllByRole("button")).toHaveLength(1);
    });
});
