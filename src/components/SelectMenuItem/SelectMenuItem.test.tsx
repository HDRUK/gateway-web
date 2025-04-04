import React from "react";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SelectMenuItem from "@/components/SelectMenuItem";
import { render, screen } from "@/utils/testUtils";

describe("SelectedMenuItem", () => {
    it("should render basic component", async () => {
        const wrapper = render(
            <SelectMenuItem itemValue="" value="" label="Menu label" />
        );

        expect(screen.getByText("Menu label")).toBeInTheDocument();
        expect(wrapper.container).toMatchSnapshot();
    });
    it("should render component with icon", async () => {
        const wrapper = render(
            <SelectMenuItem
                itemValue=""
                value=""
                icon={AccountCircleIcon}
                label="Menu label"
            />
        );

        expect(screen.getByTestId("AccountCircleIcon")).toBeInTheDocument();
        expect(wrapper.container).toMatchSnapshot();
    });
    it("should render component with right position icon", async () => {
        const wrapper = render(
            <SelectMenuItem
                itemValue=""
                value=""
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
            <SelectMenuItem
                itemValue=""
                value=""
                invertListItem
                label="Menu label"
            />
        );

        expect(wrapper.container).toMatchSnapshot();
    });
});
