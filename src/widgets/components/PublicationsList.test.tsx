import { PublicationItem } from "@/interfaces/Widget";
import { FULL_GATEWAY_URL } from "@/consts/urls";
import { render, screen, within } from "@/utils/testUtils";
import PublicationsList from "./PublicationsList";

const items: PublicationItem[] = [
    {
        id: 3170,
        paper_title: "Outcomes of a synthetic respiratory cohort",
        authors: "Jane Doe, John Smith",
        journal_name: "Journal of Examples",
        abstract: "We describe outcomes for an example cohort.",
        year_of_publication: "2024",
    },
    {
        id: 3174,
        paper_title: "Untitled preprint",
        authors: "",
        journal_name: "",
        abstract: null,
        year_of_publication: "",
    },
];

function getRowByTitle(title: string): HTMLElement {
    const link = screen.getByRole("link", { name: title });
    const row = link.closest("li");
    if (!row) throw new Error(`Could not find list item row for ${title}`);
    return row as HTMLElement;
}

describe("PublicationsList", () => {
    it("renders publication titles linking to Gateway publication pages", () => {
        render(<PublicationsList items={items} branding={{}} />);

        expect(
            screen.getByRole("link", {
                name: "Outcomes of a synthetic respiratory cohort",
            })
        ).toHaveAttribute("href", `${FULL_GATEWAY_URL}/publication/3170`);

        expect(
            screen.getByRole("link", { name: "Untitled preprint" })
        ).toHaveAttribute("href", `${FULL_GATEWAY_URL}/publication/3174`);

        // opens in new tab
        expect(
            screen.getByRole("link", {
                name: "Outcomes of a synthetic respiratory cohort",
            })
        ).toHaveAttribute("target", "_blank");
    });

    it("shows authors, journal and abstract when provided", () => {
        render(<PublicationsList items={items} branding={{}} />);

        const row = getRowByTitle("Outcomes of a synthetic respiratory cohort");
        expect(
            within(row).getByText("Jane Doe, John Smith")
        ).toBeInTheDocument();
        expect(
            within(row).getByText("Journal of Examples")
        ).toBeInTheDocument();
        expect(
            within(row).getByText("We describe outcomes for an example cohort.")
        ).toBeInTheDocument();
    });

    it("formats authors and published year with fallbacks", () => {
        render(<PublicationsList items={items} branding={{}} />);

        const row1 = getRowByTitle(
            "Outcomes of a synthetic respiratory cohort"
        );
        expect(within(row1).getByText(/^Published:/i)).toHaveTextContent(
            /^Published:\s*2024$/
        );

        const row2 = getRowByTitle("Untitled preprint");
        expect(within(row2).getByText("n/a")).toBeInTheDocument();
        expect(within(row2).getByText(/^Published:/i)).toHaveTextContent(
            /^Published:\s*n\/a$/i
        );
    });
});
