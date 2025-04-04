import ModalButtons from "@/components/ModalButtons";
import { fireEvent, render, screen, waitFor } from "@/utils/testUtils";

describe("ModalButtons", () => {
    it("should render basic modal buttons", () => {
        const wrapper = render(<ModalButtons />);

        expect(wrapper.container).toMatchSnapshot();
    });
    it("should render custom label modal buttons", async () => {
        render(<ModalButtons cancelText="Dismiss" confirmText="Save" />);

        expect(screen.getByText("Dismiss")).toBeInTheDocument();
        expect(screen.getByText("Save")).toBeInTheDocument();
    });
    it("should call custom cancel function", async () => {
        const cancelFn = jest.fn();
        render(<ModalButtons onCancel={cancelFn} />);

        fireEvent.click(screen.getByText("Cancel"));

        await waitFor(() => {
            expect(cancelFn).toHaveBeenCalled();
        });
    });
    it("should hide cancel button", async () => {
        render(<ModalButtons showCancel={false} />);

        expect(screen.queryByText("Cancel")).not.toBeInTheDocument();
    });
    it("should submit form if confirmType set to 'submit'", async () => {
        const submitFn = jest.fn(e => e.preventDefault());

        const FormComponent = () => {
            return (
                <form onSubmit={submitFn}>
                    <ModalButtons confirmType="submit" />
                </form>
            );
        };

        render(<FormComponent />);

        fireEvent.click(screen.getByText("Confirm"));

        await waitFor(() => {
            expect(submitFn).toHaveBeenCalled();
        });
    });

    it("should call custom confirm function", async () => {
        const confirmFn = jest.fn();
        render(<ModalButtons onSuccess={confirmFn} />);

        fireEvent.click(screen.getByText("Confirm"));

        await waitFor(() => {
            expect(confirmFn).toHaveBeenCalled();
        });
    });
});
