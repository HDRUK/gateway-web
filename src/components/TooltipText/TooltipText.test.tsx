import React from "react";
import userEvent from "@testing-library/user-event";
import TooltipText from "@/components/TooltipText";
import { render, screen, waitFor } from "@/utils/testUtils";

describe("TooltipText", () => {
    it("should render anchor and content", async () => {
        render(
            <TooltipText
                label="tooltip label"
                content={<div>tooltip content</div>}
            />
        );
        const label = screen.getByText("tooltip label");
        expect(label).toBeInTheDocument();

        const anchor = screen.getByTestId("tooltip");
        userEvent.hover(anchor);

        await waitFor(() => {
            const title = screen.getByText("tooltip content");
            expect(title).toBeInTheDocument();
        });
    });
});
