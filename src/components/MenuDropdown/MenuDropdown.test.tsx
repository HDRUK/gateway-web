import React from "react";
import { Button } from "@mui/material";
import MenuDropdown from "@/components/MenuDropdown";
import { fireEvent, render, screen, waitFor } from "@/utils/testUtils";

const menu = [
    {
        label: "label 1",
        href: "/",
        subItems: [{ label: "sub item label 1", href: "/" }],
    },
];

const Component = () => {
    const [anchorElement, setAnchorElement] =
        React.useState<null | HTMLElement>(null);

    return (
        <>
            <Button onClick={event => setAnchorElement(event.currentTarget)}>
                Button
            </Button>
            <MenuDropdown
                handleClose={() => setAnchorElement(null)}
                menuItems={menu}
                anchorElement={anchorElement}
            />
        </>
    );
};

describe("MenuDropdown", () => {
    it("renders sub items on opening", async () => {
        render(<Component />);

        fireEvent.click(screen.getByText("Button"));

        await waitFor(() => {
            expect(screen.getByText("sub item label 1")).toBeInTheDocument();
        });
    });
    it("should close menu on clicking sub item", async () => {
        render(<Component />);

        fireEvent.click(screen.getByText("Button"));

        await waitFor(() => {
            expect(screen.getByText("sub item label 1")).toBeInTheDocument();
        });

        fireEvent.click(screen.getByText("sub item label 1"));
        await waitFor(() => {
            expect(
                screen.queryByText("sub item label 1")
            ).not.toBeInTheDocument();
        });
    });
});
