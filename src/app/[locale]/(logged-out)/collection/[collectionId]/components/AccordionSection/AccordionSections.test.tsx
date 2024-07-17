import { Button } from "@mui/material";
import { fireEvent, render, screen } from "@/utils/testUtils";
import AccordionSection from "./AccordionSection";

describe("AccordionSection", () => {
    it("expands when showing more", () => {
        const mockContents = [
            <Button key="card1">Card 1</Button>,
            <Button key="card2">Card 2</Button>,
            <Button key="card3">Card 3</Button>,
            <Button key="card4">Card 4</Button>,
            <Button key="card5">Card 5</Button>,
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
            <Button key="card1">Card 1</Button>,
            <Button key="card2">Card 2</Button>,
            <Button key="card3">Card 3</Button>,
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
