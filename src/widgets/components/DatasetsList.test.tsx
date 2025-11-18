import { DatasetItem } from "@/interfaces/Widget";
import { FULL_GATEWAY_URL } from "@/consts/urls";
import { render, screen, within } from "@/utils/testUtils";
import DatasetsList from "./DatasetsList";

const items: DatasetItem[] = [
    {
        id: 648,
        team_id: 33,
        dataset_version_id: 1652,
        title: "Barts Research Data Extract",
        short_title: "Barts Research Data Extract",
        description: "The dataset contains multiple tables sourced from EHR.",
        raw_keywords: "Hospital Inpatient data",
        population_size: "3400000",
        start_date: "2008-01-01",
        end_date: null,
        publisher: "Barts Health NHS Trust",
    },
    {
        id: 992,
        team_id: 33,
        dataset_version_id: 1656,
        title: "Cerner Millenium EPR",
        short_title: "Cerner Millenium EPR",
        description: "",
        raw_keywords: "Outpatient",
        population_size: "",
        start_date: null,
        end_date: null,
        publisher: "",
    },
    {
        id: 1001,
        team_id: 42,
        dataset_version_id: 1700,
        title: "Some Historical Register",
        short_title: "Historical Register",
        description: "Covers events across a fixed period.",
        raw_keywords: "",
        population_size: 12500,
        start_date: "2001-02-03",
        end_date: "2001-12-31",
        publisher: "Historical Org",
    },
];

// Helper: find the <li> row for a dataset via its title link
function getRowByTitle(title: string): HTMLElement {
    const link = screen.getByRole("link", { name: title });
    const row = link.closest("li");
    if (!row) throw new Error(`Could not find list item row for ${title}`);
    return row as HTMLElement;
}

describe("DatasetsList", () => {
    it("renders dataset titles linking to Gateway dataset pages", () => {
        render(<DatasetsList items={items} />);

        expect(
            screen.getByRole("link", { name: "Barts Research Data Extract" })
        ).toHaveAttribute("href", `${FULL_GATEWAY_URL}/dataset/648`);

        expect(
            screen.getByRole("link", { name: "Cerner Millenium EPR" })
        ).toHaveAttribute("href", `${FULL_GATEWAY_URL}/dataset/992`);

        expect(
            screen.getByRole("link", { name: "Historical Register" })
        ).toHaveAttribute("href", `${FULL_GATEWAY_URL}/dataset/1001`);

        // opens in new tab
        expect(
            screen.getByRole("link", { name: "Barts Research Data Extract" })
        ).toHaveAttribute("target", "_blank");
    });

    it("renders publisher link only when publisher is present", () => {
        render(<DatasetsList items={items} />);

        const publisher1 = screen.getByRole("link", {
            name: "Barts Health NHS Trust",
        });
        expect(publisher1).toHaveAttribute(
            "href",
            `${FULL_GATEWAY_URL}/data-custodian/33`
        );
        expect(publisher1).toHaveAttribute("target", "_blank");

        // second item has no publisher
        expect(
            screen.queryByRole("link", { name: /Cerner.*publisher/i })
        ).not.toBeInTheDocument();
    });

    it("shows description when provided", () => {
        render(<DatasetsList items={items} />);
        expect(
            screen.getByText(/The dataset contains multiple tables sourced/i)
        ).toBeInTheDocument();
    });

    it("formats population size and year range with fallbacks", () => {
        render(<DatasetsList items={items} />);

        const row1 = getRowByTitle("Barts Research Data Extract");

        expect(row1).toHaveTextContent(/Dataset population size:\s*3,400,000/i);

        const dateEl1 = within(row1).getByText(/^Date range:/i);
        expect(dateEl1).toHaveTextContent(/^Date range:\s*2008\s*$/);

        const row2 = getRowByTitle("Cerner Millenium EPR");
        expect(row2).toHaveTextContent(
            /Dataset population size:\s*not reported/i
        );
        const dateEl2 = within(row2).getByText(/^Date range:/i);
        expect(dateEl2).toHaveTextContent(/^Date range:\s*n\/a\s*$/i);

        const row3 = getRowByTitle("Historical Register");
        expect(row3).toHaveTextContent(/Dataset population size:\s*12,500/i);
        const dateEl3 = within(row3).getByText(/^Date range:/i);
        expect(dateEl3).toHaveTextContent(/^Date range:\s*2001\s*$/);
    });
});
