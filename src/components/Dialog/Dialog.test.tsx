import Dialog from "@/components/Dialog";
import { fireEvent, render, screen, waitFor } from "@/utils/testUtils";

describe("Dialog", () => {
    it("should render title / content", async () => {
        render(<Dialog title="Dialog title">Dialog content</Dialog>);
        expect(await screen.getByText("Dialog title")).toBeInTheDocument();
        expect(await screen.getByText("Dialog content")).toBeInTheDocument();
    });
    it("should render title tooltip", async () => {
        render(
            <Dialog title="Dialog title" titleTooltip="Dialog tooltip">
                Dialog content
            </Dialog>
        );

        const tooltip = screen.getByTestId("InfoIcon");
        fireEvent.mouseOver(tooltip);

        const tooltipText = await screen.findByText(
            "Dialog tooltip",
            {},
            { timeout: 2000 }
        );
        expect(tooltipText).toBeInTheDocument();
    });
    it("should call onClose function when clicking close icon", async () => {
        const closeMock = jest.fn();
        render(
            <Dialog onClose={closeMock} title="Dialog title">
                Dialog content
            </Dialog>
        );

        fireEvent.click(screen.getByTestId("dialog-close-icon"));

        await waitFor(() => {
            expect(closeMock).toHaveBeenCalled();
        });
    });
});
