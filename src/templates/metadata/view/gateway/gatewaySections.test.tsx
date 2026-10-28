import { JSONSchemaDocument } from "@hdruk/gwdm-view";
import { useRouter } from "next/navigation";
import useModal from "@/hooks/useModal";
import { fireEvent, render, screen } from "@/utils/testUtils";
import { makeBaseComponents } from "../baseComponents";

jest.mock("next/navigation", () => ({
    useRouter: jest.fn(),
    usePathname: jest.fn(),
    useSearchParams: jest.fn(),
}));

jest.mock("@/hooks/useModal", () => ({
    __esModule: true,
    default: jest.fn(),
}));

const schema: JSONSchemaDocument = {
    properties: {
        observations: {
            type: "array",
            title: "Observations",
            items: {
                type: "object",
                properties: {
                    observedNode: { type: "string" },
                    measuredValue: { type: "integer" },
                },
            },
        },
        demographicFrequency: {
            type: "object",
            title: "Demographic Frequency",
            properties: { age: { type: "array", items: { type: "object" } } },
        },
        structuralMetadata: {
            type: "array",
            title: "Structural Metadata",
            items: {
                type: "object",
                properties: { name: { type: "string" } },
            },
        },
    },
};

const data = {
    observations: [{ observedNode: "Persons", measuredValue: 12 }],
    demographicFrequency: { age: [{ bin: "0-10", count: 4 }] },
    structuralMetadata: [{ name: "patients", description: "", columns: [] }],
};

const { DatasetSection } = makeBaseComponents({ data, schema });

describe("Gateway section renderers (production special sections)", () => {
    const showModal = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        (useRouter as jest.Mock).mockReturnValue({ push: jest.fn() });
        (useModal as jest.Mock).mockReturnValue({ showModal });
    });

    it("renders observations as the production observations table", () => {
        render(<DatasetSection name="observations" />);

        expect(
            screen.getByRole("heading", { name: "Observations" })
        ).toBeInTheDocument();
        // Production column headers, not the schema's raw keys.
        expect(screen.getByText("Observed Node")).toBeInTheDocument();
        expect(screen.getByText("Persons")).toBeInTheDocument();
        expect(document.getElementById("section-observations")).not.toBeNull();
    });

    it("opens demographics in the production modal", () => {
        render(<DatasetSection name="demographicFrequency" />);

        fireEvent.click(screen.getByRole("button", { name: "Open table" }));

        expect(showModal).toHaveBeenCalledWith(
            expect.objectContaining({ title: "Demographics" })
        );
        expect(
            document.getElementById("section-demographicFrequency")
        ).not.toBeNull();
    });

    it("opens structural metadata in the production modal", () => {
        render(<DatasetSection name="structuralMetadata" />);

        fireEvent.click(screen.getByRole("button", { name: "Open table" }));

        expect(showModal).toHaveBeenCalledWith(
            expect.objectContaining({ title: "Structural Metadata" })
        );
    });

    it("renders nothing for a special section with no data", () => {
        const empty = makeBaseComponents({ data: {}, schema });
        const { container } = render(
            <empty.DatasetSection name="observations" />
        );

        expect(container).toBeEmptyDOMElement();
    });

    it("still lets a template replace a special section with its own child", () => {
        render(
            <DatasetSection name="observations">
                <span>custom</span>
            </DatasetSection>
        );

        expect(screen.getByText("custom")).toBeInTheDocument();
        expect(screen.queryByText("Observed Node")).not.toBeInTheDocument();
    });
});
