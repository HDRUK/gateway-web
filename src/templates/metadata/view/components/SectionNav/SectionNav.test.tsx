import { JSONSchemaDocument } from "@/modules/MetadataView";
import { render, screen } from "@/utils/testUtils";
import SectionNav from "./SectionNav";

const schema: JSONSchemaDocument = {
    properties: {
        summary: { type: "object", title: "Summary", properties: {} },
        coverage: { type: "object", title: "Coverage", properties: {} },
        omics: { type: "object", title: "Omics", properties: {} },
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
