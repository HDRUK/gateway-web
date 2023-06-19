import React, { useState } from "react";
import AccountNav from "@/modules/AccountNav";
import { fireEvent, render, screen, waitFor } from "../testUtils";

const DemoComponent = (props: {
    onCloseMenu?: () => void;
    onLogout?: () => void;
}) => {
    const [anchorElement, setAnchorElement] = useState<null | HTMLElement>(
        null
    );
    const handleLogout = () => null;

    return (
        <>
            <input
                type="button"
                value="open nav"
                onClick={e => setAnchorElement(e.currentTarget)}
            />
            <AccountNav
                anchorElement={anchorElement}
                onCloseMenu={() => setAnchorElement(null)}
                onLogout={handleLogout}
                {...props}
            />
        </>
    );
};

DemoComponent.defaultProps = {
    onLogout: () => null,
    onCloseMenu: () => null,
};

describe("AccountNav", () => {
    it("should render component", async () => {
        const wrapper = render(<DemoComponent />);

        expect(wrapper.container).toMatchSnapshot();
    });

    it("should call logout", async () => {
        const onLogout = jest.fn();

        render(<DemoComponent onLogout={onLogout} />);

        fireEvent.click(screen.getByText("open nav"));

        await waitFor(() => {
            expect(screen.getByText("Logout")).toBeInTheDocument();
        });

        fireEvent.click(screen.getByText("Logout"));

        expect(onLogout).toHaveBeenCalled();
    });

    it("should call onCloseMenu", async () => {
        const onCloseMenu = jest.fn();

        render(<DemoComponent onCloseMenu={onCloseMenu} />);

        fireEvent.click(screen.getByText("open nav"));

        await waitFor(() => {
            expect(screen.getByText("Profile")).toBeInTheDocument();
        });

        fireEvent.click(screen.getByText("Profile"));

        expect(onCloseMenu).toHaveBeenCalled();
    });
});
