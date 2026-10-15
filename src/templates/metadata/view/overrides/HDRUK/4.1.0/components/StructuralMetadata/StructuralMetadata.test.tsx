import fs from "fs";
import { JSONSchemaDocument } from "@/modules/MetadataView";
import { render, screen } from "@/utils/testUtils";
import { DataTable } from "@/generated/schemas/HDRUK/4.1.0";
import DatasetSection from "../../../../../components/DatasetSection";
import StructuralMetadata, { mergeTables } from "./StructuralMetadata";

const schema = JSON.parse(
    fs.readFileSync("/tmp/hdruk.json", "utf-8")
) as JSONSchemaDocument;

const tables = [
    {
        name: "COG-UK (NI)",
        description: "Sample identifiers",
        columns: [
            {
                name: "Specimen ID",
                dataType: "Alphanumeric",
                description: "Unique specimen number",
                sensitive: false,
            },
        ],
    },
    {
        name: "COG-UK (NI)",
        description: "Lineage",
        columns: [
            {
                name: "Lineage",
                dataType: "Alphanumeric",
                description: "Pangolin lineage",
                sensitive: false,
            },
        ],
    },
] as unknown as DataTable[];

const data = { structuralMetadata: { tables } };

describe("StructuralMetadata", () => {
    it("receives the section's data and keeps the section heading and anchor", () => {
        const { container } = render(
            <DatasetSection
                name="structuralMetadata"
                data={data}
                schema={schema}>
                <StructuralMetadata />
            </DatasetSection>
        );

        expect(
            screen.getByRole("heading", { name: "Structural metadata" })
        ).toBeInTheDocument();
        expect(
            container.querySelector("#section-structuralMetadata")
        ).not.toBeNull();
        expect(
            container.querySelectorAll(".MuiAccordionSummary-content")
        ).toHaveLength(2);
    });

    it("renders whatever mergeTables returns", () => {
        const merged = [
            {
                name: "COG-UK (NI)",
                columns: [...tables[0].columns, ...tables[1].columns],
            },
        ] as unknown as DataTable[];

        const { container } = render(
            <DatasetSection
                name="structuralMetadata"
                data={{ structuralMetadata: { tables: merged } }}
                schema={schema}>
                <StructuralMetadata />
            </DatasetSection>
        );

        expect(
            container.querySelectorAll(".MuiAccordionSummary-content")
        ).toHaveLength(1);
        expect(screen.getByText("Specimen ID")).toBeInTheDocument();
        expect(screen.getByText("Lineage")).toBeInTheDocument();
    });

    it("mergeTables is the seam and currently passes through", () => {
        expect(mergeTables(tables)).toEqual(tables);
    });
});
