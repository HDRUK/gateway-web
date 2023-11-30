import React, { useState } from "react";
import AccountNav from "@/modules/AccountNav";
import { userV1 } from "@/mocks/data";
import { fireEvent, render, screen, waitFor } from "@/utils/testUtils";

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

        const fullname = `${userV1.firstname} ${userV1.lastname}`;
        await waitFor(() => {
            expect(screen.getByText(fullname)).toBeInTheDocument();
        });

        fireEvent.click(screen.getByText(fullname));

        expect(onCloseMenu).toHaveBeenCalled();
    });
});
