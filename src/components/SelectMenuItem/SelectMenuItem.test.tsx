import React from "react";
import SelectMenuItem from "@/components/SelectMenuItem";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { render, screen } from "@/utils/testUtils";

describe("SelectedMenuItem", () => {
    it("should render basic component", async () => {
        const wrapper = render(<SelectMenuItem label="Menu label" />);

        expect(screen.getByText("Menu label")).toBeInTheDocument();
        expect(wrapper.container).toMatchSnapshot();
    });
    it("should render component with icon", async () => {
        const wrapper = render(
            <SelectMenuItem icon={AccountCircleIcon} label="Menu label" />
        );

        expect(screen.getByTestId("AccountCircleIcon")).toBeInTheDocument();
        expect(wrapper.container).toMatchSnapshot();
    });
    it("should render component with right position icon", async () => {
        const wrapper = render(
            <SelectMenuItem
                iconRight
                icon={AccountCircleIcon}
                label="Menu label"
            />
        );

        expect(screen.getByTestId("AccountCircleIcon")).toBeInTheDocument();
        expect(wrapper.container).toMatchSnapshot();
    });
    it("should render invertListItem component ", async () => {
        const wrapper = render(
            <SelectMenuItem invertListItem label="Menu label" />
        );

        expect(wrapper.container).toMatchSnapshot();
    });
});
