import { fireEvent, render, screen } from "@/utils/testUtils";
import Dropdown from "./HeaderNavDropdown";

describe("HeaderNavDropdown", () => {
    const mockDropMenus = [
        {
            label: "Menu 1",
            href: "/menu1",
            subtext: "Subtext 1",
        },
        {
            label: "Menu 2",
            href: "/menu2",
            subtext: "Subtext 2",
        },
    ];

    it("renders the dropdown with menu items", () => {
        const onCloseMenu = jest.fn();
        const anchorElement = document.createElement("div");
        render(
            <Dropdown
                onCloseMenu={onCloseMenu}
                anchorElement={anchorElement}
                dropMenus={mockDropMenus}
            />
        );

        const menu1 = screen.getByText("Menu 1");
        const menu2 = screen.getByText("Menu 2");
        expect(menu1).toBeInTheDocument();
        expect(menu2).toBeInTheDocument();

        const subtext1 = screen.getByText("Subtext 1");
        const subtext2 = screen.getByText("Subtext 2");
        expect(subtext1).toBeInTheDocument();
        expect(subtext2).toBeInTheDocument();
    });

    it("calls onCloseMenu when a menu item is clicked", () => {
        const onCloseMenu = jest.fn();
        const anchorElement = document.createElement("div");
        render(
            <Dropdown
                onCloseMenu={onCloseMenu}
                anchorElement={anchorElement}
                dropMenus={mockDropMenus}
            />
        );

        const menu1 = screen.getByText("Menu 1");
        fireEvent.click(menu1);

        expect(onCloseMenu).toHaveBeenCalled();
    });
});
