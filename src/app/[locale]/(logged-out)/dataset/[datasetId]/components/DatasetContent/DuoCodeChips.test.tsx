import { ReactNode } from "react";
import { render, screen, within } from "@/utils/testUtils";
import DuoCodeChips from "./DuoCodeChips";

// MUI's hover-and-popper tooltip does not open under jsdom, so render each
// tooltip's title inline: the content is what this component controls.
jest.mock("@mui/material", () => ({
    ...jest.requireActual("@mui/material"),
    Tooltip: ({
        title,
        children,
    }: {
        title: ReactNode;
        children: ReactNode;
    }) => (
        <>
            {children}
            <div data-testid="tooltip">{title}</div>
        </>
    ),
}));

const details = {
    "DUO:0000042": {
        shortcode: "GRU",
        label: "General research use",
        description: "Use allowed for general research.",
    },
};

describe("DuoCodeChips", () => {
    it("shows a known code by its shortcode", () => {
        render(<DuoCodeChips codes={["DUO:0000042"]} details={details} />);

        expect(screen.getByText("GRU")).toBeInTheDocument();
    });

    it("explains a known code in a tooltip, with a link to OLS", () => {
        render(<DuoCodeChips codes={["DUO:0000042"]} details={details} />);

        const tooltip = screen.getByTestId("tooltip");
        expect(
            within(tooltip).getByText("General research use (DUO 0000042)")
        ).toBeInTheDocument();
        expect(
            within(tooltip).getByText("Use allowed for general research.")
        ).toBeInTheDocument();
        expect(within(tooltip).getByRole("link")).toHaveAttribute(
            "href",
            expect.stringContaining("ebi.ac.uk/ols4/ontologies/duo")
        );
    });

    it("shows an unknown code as-is, with no tooltip", () => {
        render(<DuoCodeChips codes={["DUO:9999999"]} details={details} />);

        expect(screen.getByText("DUO:9999999")).toBeInTheDocument();
        expect(screen.queryByTestId("tooltip")).not.toBeInTheDocument();
    });

    it("splits a delimited string of codes", () => {
        render(
            <DuoCodeChips codes="DUO:0000042,DUO:9999999" details={details} />
        );

        expect(screen.getByText("GRU")).toBeInTheDocument();
        expect(screen.getByText("DUO:9999999")).toBeInTheDocument();
    });
});
