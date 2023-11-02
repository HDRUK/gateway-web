import React from "react";
import Tooltip from "@/components/Tooltip";
import { render, screen, waitFor } from "@/utils/testUtils";
import userEvent from "@testing-library/user-event";

describe("Tooltip", () => {
    it("should render anchor and content", async () => {
        render(
            <Tooltip title="tooltip title">
                <div>tooltip content</div>
            </Tooltip>
        );
        const anchor = screen.getByText("tooltip content");
        expect(anchor).toBeInTheDocument();

        userEvent.hover(anchor);

        await waitFor(() => {
            const title = screen.getByText("tooltip title");
            expect(title).toBeInTheDocument();
        });
    });
});
