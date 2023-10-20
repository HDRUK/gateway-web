import React from "react";
import TooltipIcon from "@/components/TooltipIcon";
import { render, screen, waitFor } from "@/utils/testUtils";
// eslint-disable-next-line import/no-extraneous-dependencies
import userEvent from "@testing-library/user-event";

describe("TooltipIcon", () => {
    it("should render anchor and content", async () => {
        render(
            <TooltipIcon
                label="tooltip label"
                content={<div>tooltip content</div>}
            />
        );
        const label = screen.getByText("tooltip label");
        expect(label).toBeInTheDocument();

        const anchor = screen.getByTestId("HelpOutlineIcon");
        userEvent.hover(anchor);

        await waitFor(() => {
            const title = screen.getByText("tooltip content");
            expect(title).toBeInTheDocument();
        });
    });
});
