import { render, screen } from "@/utils/testUtils";
import ResultCardARDC from "./ResultCardARDC";

const mockResult = {
    id: "1",
    slug: "datasets/test-dataset",
    display_title: "Test Dataset Title",
    group: "Test Organisation",
    description: "A test description",
};

describe("ResultCardARDC", () => {
    it("renders img with correct src when providerLogo is provided", () => {
        render(
            <ResultCardARDC
                result={mockResult}
                providerLogo="https://example.com/logo.png"
            />
        );
        expect(screen.getByRole("img", { name: "ARDC" })).toHaveAttribute(
            "src",
            "https://example.com/logo.png"
        );
    });

    it("does not render a logo img when providerLogo is undefined", () => {
        render(<ResultCardARDC result={mockResult} />);
        expect(
            screen.queryByRole("img", { name: "ARDC" })
        ).not.toBeInTheDocument();
    });

    it("link opens in a new tab with rel noopener", () => {
        render(<ResultCardARDC result={mockResult} />);
        const link = screen.getByRole("link");
        expect(link).toHaveAttribute("target", "_blank");
        expect(link).toHaveAttribute(
            "rel",
            expect.stringContaining("noopener")
        );
    });

    it("link href uses id when present", () => {
        render(<ResultCardARDC result={mockResult} />);
        expect(screen.getByRole("link")).toHaveAttribute(
            "href",
            "https://researchdata.edu.au/health/view/1"
        );
    });

    it("link href falls back to ARDC base URL when id is absent", () => {
        render(<ResultCardARDC result={{ ...mockResult, id: "" }} />);
        expect(screen.getByRole("link")).toHaveAttribute(
            "href",
            "https://researchdata.edu.au/health/view"
        );
    });
});
