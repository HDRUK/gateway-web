import { Button } from "@mui/material";
import { fireEvent, render, screen } from "@/utils/testUtils";
import AccordionSection from "./AccordionSection";

describe("AccordionSection", () => {
    it("expands when showing more", () => {
        const mockContents = [
            <Button>Card 1</Button>,
            <Button>Card 2</Button>,
            <Button>Card 3</Button>,
            <Button>Card 4</Button>,
            <Button>Card 5</Button>,
        ];

        render(
            <AccordionSection heading="Accordion" contents={mockContents} />
        );

        const accordion = screen.getByText(/accordion/i);

        fireEvent.click(accordion);

        const showMore = screen.getByText(/show more/i);

        fireEvent.click(showMore);

        expect(screen.getAllByRole("button")).toHaveLength(7);
    });

    it("expands when showing more", () => {
        const mockContents = [
            <Button>Card 1</Button>,
            <Button>Card 2</Button>,
            <Button>Card 3</Button>,
        ];

        render(
            <AccordionSection heading="Accordion" contents={mockContents} />
        );

        const accordion = screen.getByText(/accordion/i);

        fireEvent.click(accordion);

        const showMore = screen.queryByText(/show more/i);

        expect(showMore).not.toBeInTheDocument();
    });
});
