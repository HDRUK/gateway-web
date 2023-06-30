import Dialog from "@/components/Dialog";
import { fireEvent, render, screen, waitFor } from "../testUtils";

describe("Dialog", () => {
    it("should render title / content", async () => {
        render(<Dialog title="Dialog title">Dialog content</Dialog>);
        expect(await screen.getByText("Dialog title")).toBeInTheDocument();
        expect(await screen.getByText("Dialog content")).toBeInTheDocument();
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
