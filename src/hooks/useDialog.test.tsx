import { act } from "react-dom/test-utils";
import MuiDialogActions from "@mui/material/DialogActions";
import MuiDialogContent from "@mui/material/DialogContent";
import Dialog from "@/components/Dialog";
import ModalButtons from "@/components/ModalButtons";
import useDialog from "@/hooks/useDialog";
import { fireEvent, renderHook, screen, waitFor } from "@/utils/testUtils";

describe("useDialog", () => {
    const SimpleDialog = () => {
        const { store } = useDialog();
        const { dialogProps } = store as unknown as {
            dialogProps: {
                onCancel: () => void;
                onSuccess: (val: string) => void;
                foo: string;
            };
        };
        return (
            <Dialog onClose={dialogProps?.onCancel} title="Dialog title">
                <MuiDialogContent>
                    <p>Dialog content</p>
                    <p>{dialogProps?.foo}</p>
                </MuiDialogContent>
                <MuiDialogActions>
                    <ModalButtons
                        onCancel={() => dialogProps?.onCancel()}
                        onSuccess={() => dialogProps?.onSuccess("successful")}
                    />
                </MuiDialogActions>
            </Dialog>
        );
    };

    const props = {
        foo: "Bar",
        onSuccess: jest.fn(),
        onCancel: jest.fn(),
    };

    it("should render content and title", async () => {
        const { result } = renderHook(() => useDialog());

        act(() => {
            result.current.showDialog(SimpleDialog, props);
        });

        await waitFor(() => {
            expect(screen.getByText("Dialog title")).toBeInTheDocument();
            expect(screen.getByText("Dialog content")).toBeInTheDocument();
        });
    });

    it("should call function from where dialog was invoked", async () => {
        const { result } = renderHook(() => useDialog());

        act(() => {
            result.current.showDialog(SimpleDialog, props);
        });

        await waitFor(
            () => {
                expect(screen.getByText("Dialog title")).toBeInTheDocument();
            },
            { timeout: 300 }
        );

        fireEvent.click(screen.getByText("Confirm"));

        await waitFor(
            () => {
                expect(props.onSuccess).toHaveBeenCalledWith("successful");
            },
            { timeout: 300 }
        );
    });

    it("should render prop from where dialog was invoked", async () => {
        const { result } = renderHook(() => useDialog());

        act(() => {
            result.current.showDialog(SimpleDialog, props);
        });

        await waitFor(
            () => {
                expect(screen.getByText("Bar")).toBeInTheDocument();
            },
            { timeout: 300 }
        );
    });

    it("should call onClose prop when selecting `Cancel`", async () => {
        const { result } = renderHook(() => useDialog());

        act(() => {
            result.current.showDialog(SimpleDialog, props);
        });

        await waitFor(
            () => {
                expect(screen.getByText("Dialog title")).toBeInTheDocument();
            },
            { timeout: 300 }
        );

        fireEvent.click(screen.getByText("Cancel"));

        await waitFor(
            () => {
                expect(props.onCancel).toHaveBeenCalled();
            },
            { timeout: 300 }
        );
    });

    it("should call onClose prop when selecting `Close` icon", async () => {
        const { result } = renderHook(() => useDialog());

        act(() => {
            result.current.showDialog(SimpleDialog, props);
        });

        await waitFor(
            () => {
                expect(screen.getByText("Dialog title")).toBeInTheDocument();
            },
            { timeout: 300 }
        );

        fireEvent.click(screen.getByTestId("dialog-close-icon"));

        await waitFor(
            () => {
                expect(props.onCancel).toHaveBeenCalled();
            },
            { timeout: 300 }
        );
    });
});
