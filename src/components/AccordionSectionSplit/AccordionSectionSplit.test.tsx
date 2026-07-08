import { render, screen } from "@/utils/testUtils";
import AccordionSectionSplit from "./AccordionSectionSplit";

const makeContents = (label: string, count: number) =>
    Array.from({ length: count }, (_, index) => (
        <div key={`${label}_${index}`}>{`${label} ${index + 1}`}</div>
    ));

describe("AccordionSectionSplit", () => {
    it("renders both pane headings with counts and cards", () => {
        render(
            <AccordionSectionSplit
                heading="Datasets"
                ownedHeading="Datasets"
                ownedCount={2}
                associatedHeading="Associated datasets"
                associatedCount={1}
                ownedContents={makeContents("Owned", 2)}
                associatedContents={makeContents("Associated", 1)}
                defaultExpanded
            />
        );

        expect(screen.getAllByText("Datasets")).toHaveLength(2);
        expect(screen.getByText("Associated datasets")).toBeInTheDocument();
        expect(screen.getByText("(2)")).toBeInTheDocument();
        expect(screen.getByText("(1)")).toBeInTheDocument();
        expect(screen.getByText("Owned 1")).toBeInTheDocument();
        expect(screen.getByText("Owned 2")).toBeInTheDocument();
        expect(screen.getByText("Associated 1")).toBeInTheDocument();
    });

    it("renders the section title as a single h2 with no heading nested inside", () => {
        render(
            <AccordionSectionSplit
                heading="Datasets"
                ownedHeading="Datasets"
                ownedCount={2}
                associatedHeading="Associated datasets"
                associatedCount={1}
                ownedContents={makeContents("Owned", 2)}
                associatedContents={makeContents("Associated", 1)}
                defaultExpanded
            />
        );

        const sectionHeading = screen.getByRole("heading", {
            level: 2,
            name: "Datasets",
        });
        expect(sectionHeading).toBeInTheDocument();
        expect(
            sectionHeading.querySelector("h1, h2, h3, h4, h5, h6")
        ).toBeNull();
    });

    it("hides the associated pane when there are no associated items", () => {
        render(
            <AccordionSectionSplit
                heading="Datasets"
                ownedHeading="Datasets"
                ownedCount={2}
                associatedHeading="Associated datasets"
                associatedCount={0}
                ownedContents={makeContents("Owned", 2)}
                associatedContents={[]}
                defaultExpanded
            />
        );

        expect(screen.getByText("(2)")).toBeInTheDocument();
        expect(
            screen.queryByText("Associated datasets")
        ).not.toBeInTheDocument();
    });

    it("hides the owned pane when there are no owned items", () => {
        render(
            <AccordionSectionSplit
                heading="Datasets"
                ownedHeading="Datasets"
                ownedCount={0}
                associatedHeading="Associated datasets"
                associatedCount={1}
                ownedContents={[]}
                associatedContents={makeContents("Associated", 1)}
                defaultExpanded
            />
        );

        expect(screen.queryByText("(0)")).not.toBeInTheDocument();
        expect(screen.getByText("Associated datasets")).toBeInTheDocument();
        expect(screen.getByText("(1)")).toBeInTheDocument();
    });
});
