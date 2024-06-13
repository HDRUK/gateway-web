import React from "react";
import CardActions from "@/components/CardActions";
import { ArchiveIcon, EditIcon } from "@/consts/icons";
import { render, screen } from "@/utils/testUtils";

describe("CardActions", () => {
    const mockAction = jest.fn();

    const actions = [
        {
            label: "First item",
            icon: EditIcon,
            href: "/this/is/the/href",
        },
        {
            label: "Second item",
            icon: ArchiveIcon,
            action: mockAction,
        },
    ];

    it("should render href action", async () => {
        const { container } = render(<CardActions id={1} actions={actions} />);

        const buttons = screen.getAllByRole("button");
        expect(buttons[0]).toHaveAttribute("aria-label", "First item");

        const linkElement = container.querySelector("a");
        expect(linkElement).toHaveAttribute("href", `${actions[0].href}/1`);

        expect(screen.getByTestId("EditIcon"));
    });
    it("should render onClick action", async () => {
        render(<CardActions id={1} actions={actions} />);

        const buttons = screen.getAllByRole("button");
        expect(buttons[1]).toHaveAttribute("aria-label", "Second item");

        expect(screen.getByTestId("ArchiveIcon"));
    });
    it("should call onClick action passing id", async () => {
        render(<CardActions id={1} actions={actions} />);

        const buttons = screen.getAllByRole("button");
        buttons[1].click();

        expect(mockAction).toHaveBeenCalledWith(1);
    });
});
