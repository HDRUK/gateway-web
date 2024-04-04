import { render, screen } from "@/utils/testUtils";
import ResultCardPublication from "./ResultCardPublication";

const MOCK_DATA = {
    abstract: "Abstract",
    authors: "Authors",
    journal_name: "Journal name",
    paper_title: "Paper",
    year_of_publication: "Year",
    _id: "1",
};

describe("ResultCardPublication", () => {
    it("should render with all data", async () => {
        render(<ResultCardPublication result={MOCK_DATA} />);

        expect(screen.getByText(MOCK_DATA.abstract)).toBeInTheDocument();
        expect(screen.getAllByText(MOCK_DATA.authors)[0]).toBeInTheDocument();
        expect(screen.getByText(MOCK_DATA.journal_name)).toBeInTheDocument();
        expect(screen.getByText(MOCK_DATA.paper_title)).toBeInTheDocument();
        expect(
            screen.getByText(`Published: ${MOCK_DATA.year_of_publication}`)
        ).toBeInTheDocument();
    });
    it("should render `Not available` when no authors", async () => {
        render(
            <ResultCardPublication
                result={{ ...MOCK_DATA, authors: undefined }}
            />
        );
        expect(screen.getAllByText(`Not available`)[0]).toBeInTheDocument();
    });
});
