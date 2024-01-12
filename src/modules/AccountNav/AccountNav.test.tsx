import React, { useState } from "react";
import AccountNav from "@/modules/AccountNav";
import useLogout from "@/hooks/useLogout";
import { fireEvent, render, screen, waitFor } from "@/utils/testUtils";
import { userV1 } from "@/mocks/data";

jest.mock("@/hooks/useLogout", () => jest.fn());

const DemoComponent = (props: { onCloseMenu?: () => void }) => {
    const [anchorElement, setAnchorElement] = useState<null | HTMLElement>(
        null
    );

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
        const mockLogout = jest.fn();

        (useLogout as jest.Mock).mockReturnValue(mockLogout);
        render(<DemoComponent />);

        fireEvent.click(screen.getByText("open nav"));

        await waitFor(() => {
            expect(screen.getByText("Logout")).toBeInTheDocument();
        });

        fireEvent.click(screen.getByText("Logout"));

        expect(mockLogout).toHaveBeenCalled();
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
