import { Button } from "@hdruk/ui";
import { fireEvent, render, screen } from "@/utils/testUtils";
import AccordionSection from "./AccordionSection";

describe("AccordionSection", () => {
    it("expands when showing more", () => {
        const mockContents = [
            <Button variant="text" key="card1">
                Card 1
            </Button>,
            <Button variant="text" key="card2">
                Card 2
            </Button>,
            <Button variant="text" key="card3">
                Card 3
            </Button>,
            <Button variant="text" key="card4">
                Card 4
            </Button>,
            <Button variant="text" key="card5">
                Card 5
            </Button>,
            <Button variant="text" key="card6">
                Card 6
            </Button>,
            <Button variant="text" key="card7">
                Card 7
            </Button>,
        ];

        render(
            <AccordionSection
                heading="Accordion"
                title="Accordion"
                contents={mockContents}
            />
        );

        const accordion = screen.getAllByText(/accordion/i)[0];

        fireEvent.click(accordion);

        const showMore = screen.getByText(/show more/i);

        fireEvent.click(showMore);

        expect(screen.getAllByRole("button")).toHaveLength(9);
    });

    it("expands when showing more", () => {
        const mockContents = [
            <Button variant="text" key="card1">
                Card 1
            </Button>,
            <Button variant="text" key="card2">
                Card 2
            </Button>,
            <Button variant="text" key="card3">
                Card 3
            </Button>,
        ];

        render(
            <AccordionSection
                heading="Accordion"
                title="Accordion"
                contents={mockContents}
            />
        );

        const accordion = screen.getAllByText(/accordion/i)[0];

        fireEvent.click(accordion);

        const showMore = screen.queryByText(/show more/i);

        expect(showMore).not.toBeInTheDocument();
    });
});
