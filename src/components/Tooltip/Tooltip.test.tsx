import Tooltip from "@/components/Tooltip";
import { fireEvent, render, screen, waitFor } from "@/utils/testUtils";

describe("Tooltip", () => {
    it("should render anchor and content", async () => {
        render(
            <Tooltip title="tooltip title">
                <div>tooltip content</div>
            </Tooltip>
        );
        const anchor = screen.getByText("tooltip content");
        expect(anchor).toBeInTheDocument();

        fireEvent.mouseOver(anchor);

        await waitFor(() => {
            const title = screen.getByText("tooltip title");
            expect(title).toBeInTheDocument();
        });
    });
});
