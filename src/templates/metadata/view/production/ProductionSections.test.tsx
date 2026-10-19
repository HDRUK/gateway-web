import { useRouter } from "next/navigation";
import { render, screen, within } from "@/utils/testUtils";
import ProductionSections from "./ProductionSections";

jest.mock("next/navigation", () => ({
    useRouter: jest.fn(),
    usePathname: jest.fn(),
    useSearchParams: jest.fn(),
}));

const data = {
    summary: {
        abstract: "An abstract.",
        doiName: "10.1234/example",
        description: "Includes:\n\n- Papers\n- Preprints",
        keywords: "Cancer,HPV",
    },
    required: { modified: "2021-01-28T14:15:46Z" },
    accessibility: {
        usage: { duoCodes: ["DUO:0000042"] },
        access: { accessRights: "https://example.com/terms" },
    },
    observations: [
        {
            observedNode: "Persons",
            measuredValue: 12,
            measuredProperty: "Count",
            observationDate: "2020-01-01",
            disambiguatingDescription: "",
        },
    ],
};

const duoCodeDetails = {
    "DUO:0000042": {
        shortcode: "GRU",
        label: "General research use",
        description: "General research.",
    },
};

const renderSections = () =>
    render(<ProductionSections data={data} duoCodeDetails={duoCodeDetails} />);

describe("ProductionSections", () => {
    beforeEach(() => {
        (useRouter as jest.Mock).mockReturnValue({ push: jest.fn() });
    });

    it("renders production's section headings in production's order", () => {
        renderSections();

        expect(
            screen.getAllByRole("heading").map(heading => heading.textContent)
        ).toEqual([
            "Summary",
            "Documentation",
            "Keywords",
            "Observations",
            "Details",
            "Data Access Request",
        ]);
    });

    it("anchors sections as production does, positionally and by name", () => {
        const { container } = renderSections();

        // ActiveListSidebar scrolls to #anchor{n}; stats and the mind map to
        // anchor-{SectionName}.
        expect(
            container.querySelector("#anchor1 #anchor-Summary")
        ).not.toBeNull();
        expect(
            container.querySelector("#anchor3 #anchor-Keywords")
        ).not.toBeNull();
        expect(
            container.querySelector("#anchor-DataAccessRequest")
        ).not.toBeNull();
    });

    it("uses production's field labels", () => {
        renderSections();

        expect(screen.getByText("DOI for dataset")).toBeInTheDocument();
        expect(screen.getByText("Modified")).toBeInTheDocument();
        expect(screen.getByText("Access rights")).toBeInTheDocument();
    });

    it("renders each value the way production renders its field type", () => {
        const { container } = renderSections();

        expect(
            screen.getByRole("button", { name: "Cancer" })
        ).toBeInTheDocument();
        expect(
            screen.getByRole("link", {
                name: "https://doi.org/10.1234/example",
            })
        ).toBeInTheDocument();
        expect(screen.getByText("28/01/2021")).toBeInTheDocument();
        expect(container.querySelectorAll("li")).toHaveLength(2);
        expect(screen.getByText("GRU")).toBeInTheDocument();
    });

    it("renders observations as the production observations table", () => {
        renderSections();

        const section = screen.getByRole("heading", { name: "Observations" })
            .parentElement as HTMLElement;
        expect(within(section).getByText("Observed Node")).toBeInTheDocument();
        expect(within(section).getByText("Persons")).toBeInTheDocument();
    });

    it("renders nothing when no production section has data", () => {
        const { container } = render(<ProductionSections data={{}} />);

        expect(container).toBeEmptyDOMElement();
    });
});
