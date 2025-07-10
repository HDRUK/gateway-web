import userEvent from "@testing-library/user-event";
import TooltipText from "@/components/TooltipText";
import { render, screen } from "@/utils/testUtils";

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

        const title = await screen.findByText(
            "tooltip content",
            {},
            { timeout: 2000 }
        );
        expect(title).toBeInTheDocument();
    });
});
