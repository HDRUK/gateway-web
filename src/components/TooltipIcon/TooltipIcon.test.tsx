import userEvent from "@testing-library/user-event";
import TooltipIcon from "@/components/TooltipIcon";
import { render, screen } from "@/utils/testUtils";

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

        const anchor = screen.getByTestId("InfoIcon");
        userEvent.hover(anchor);

        const title = await screen.findByText(
            "tooltip content",
            {},
            { timeout: 2000 }
        );
        expect(title).toBeInTheDocument();
    });
});
