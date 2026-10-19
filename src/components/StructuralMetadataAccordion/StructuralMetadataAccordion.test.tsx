import { render, screen } from "@/utils/testUtils";
import StructuralMetadataAccordion from "./StructuralMetadataAccordion";

const table = (overrides: Record<string, unknown>) => ({
    name: "Patients",
    description: "One row per patient.",
    ...overrides,
});

const columns = [
    {
        name: "patient_id",
        description: "Identifier.",
        dataType: "int",
        sensitive: false,
    },
];

describe("StructuralMetadataAccordion", () => {
    it("lists a table's columns", () => {
        render(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            <StructuralMetadataAccordion metadata={[table({ columns })] as any} />
        );

        expect(screen.getByText("Patients")).toBeInTheDocument();
        expect(screen.getByText("patient_id")).toBeInTheDocument();
    });

    it("reads the HDRUK-translated { tables } shape as well as a bare array", () => {
        render(
            <StructuralMetadataAccordion
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                metadata={{ tables: [table({ columns })] } as any}
            />
        );

        expect(screen.getByText("Patients")).toBeInTheDocument();
    });

    /**
     * REGRESSION: a GWDM record can reach the page with `columns` missing or
     * null - nothing validates a stored record on read, and only the GWDM page
     * renders stored tables directly, so the HDRUK-translated page never saw
     * it. Throwing here happens inside the modal, during a click, and takes the
     * whole page down rather than just the dialog.
     */
    it.each([
        ["missing", table({})],
        ["null", table({ columns: null })],
        ["not an array", table({ columns: "nonsense" })],
    ])("renders a table whose columns are %s", (_label, badTable) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        render(<StructuralMetadataAccordion metadata={[badTable] as any} />);

        expect(screen.getByText("Patients")).toBeInTheDocument();
    });

    it("keeps the good tables when one is malformed", () => {
        render(
            <StructuralMetadataAccordion
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                metadata={[table({}), table({ name: "Visits", columns })] as any}
            />
        );

        expect(screen.getByText("Patients")).toBeInTheDocument();
        expect(screen.getByText("Visits")).toBeInTheDocument();
    });

    it("renders nothing without metadata", () => {
        const { container } = render(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            <StructuralMetadataAccordion metadata={null as any} />
        );

        expect(container).toBeEmptyDOMElement();
    });
});
