import { JSONSchemaDocument } from "@/modules/MetadataView";
import { render, screen } from "@/utils/testUtils";
import Prose from "../Prose";
import DatasetSection from "./DatasetSection";

const schema: JSONSchemaDocument = {
    properties: {
        summary: {
            type: "object",
            title: "Summary",
            properties: {
                abstract: { type: "string", title: "Dataset abstract" },
                title: { type: "string", title: "Title" },
            },
        },
        coverage: {
            type: "object",
            title: "Coverage",
            properties: { spatial: { type: "string", title: "Spatial" } },
        },
    },
};

const data = {
    summary: { abstract: "A record of patients.", title: "Medical cards" },
    coverage: { spatial: "Northern Ireland" },
};

describe("DatasetSection", () => {
    it("renders only the named section", () => {
        render(<DatasetSection name="coverage" data={data} schema={schema} />);

        expect(screen.getByText("Coverage")).toBeInTheDocument();
        expect(screen.queryByText("Summary")).not.toBeInTheDocument();
    });

    it("renders nothing for a section with no data", () => {
        const { container } = render(
            <DatasetSection name="coverage" data={{}} schema={schema} />
        );

        expect(container).not.toHaveTextContent("Coverage");
    });

    it("hands the section's data to a child and keeps the rows with `fields`", () => {
        render(
            <DatasetSection name="summary" data={data} schema={schema} fields>
                <Prose field="abstract" />
            </DatasetSection>
        );

        expect(screen.getAllByText("A record of patients.")).toHaveLength(2);
        expect(screen.getByText("Title")).toBeInTheDocument();
    });

    it("drops a field the child has already covered", () => {
        render(
            <DatasetSection
                name="summary"
                data={data}
                schema={schema}
                fields
                exclude={["abstract"]}>
                <Prose field="abstract" />
            </DatasetSection>
        );

        expect(screen.getAllByText("A record of patients.")).toHaveLength(1);
        expect(screen.queryByText("Dataset abstract")).not.toBeInTheDocument();
        expect(screen.getByText("Title")).toBeInTheDocument();
    });

    it("with `fields`, renders the heading, then the child, then the rows", () => {
        // As the production page does: "Summary", the abstract, then fields.
        const { container } = render(
            <DatasetSection
                name="summary"
                data={data}
                schema={schema}
                fields
                exclude={["abstract"]}>
                <Prose field="abstract" />
            </DatasetSection>
        );

        const text = container.textContent ?? "";
        const heading = text.indexOf("Summary");
        const abstract = text.indexOf("A record of patients.");
        const row = text.indexOf("Title");

        expect(
            screen.getAllByRole("heading", { name: "Summary" })
        ).toHaveLength(1);
        expect(heading).toBeLessThan(abstract);
        expect(abstract).toBeLessThan(row);
        expect(container.querySelector("#section-summary")).toHaveTextContent(
            "A record of patients."
        );
    });
});
