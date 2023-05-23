import useDialog from "@/hooks/useDialog";
import { act } from "react-dom/test-utils";
import Dialog from "@/components/Dialog";
import MuiDialogContent from "@mui/material/DialogContent";
import MuiDialogActions from "@mui/material/DialogActions";
import ModalButtons from "@/components/ModalButtons";
import { fireEvent, renderHook, screen, waitFor } from "../testUtils";

describe("useDialog", () => {
    const SimpleDialog = () => {
        const { store } = useDialog();
        const { dialogProps } = store;
        return (
            <Dialog title="Dialog title">
                <MuiDialogContent>
                    <p>Dialog content</p>
                    <p>{dialogProps?.foo}</p>
                </MuiDialogContent>
                <MuiDialogActions>
                    <ModalButtons
                        onSuccess={() => dialogProps?.onSuccess("successful")}
                    />
                </MuiDialogActions>
            </Dialog>
        );
    };

    const props = {
        foo: "Bar",
        onSuccess: jest.fn(),
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

    it("should call confirm from function where dialog is invoked", async () => {
        const { result } = renderHook(() => useDialog());

        act(() => {
            result.current.showDialog(SimpleDialog, props);
        });

        await waitFor(() => {
            expect(screen.getByText("Dialog title")).toBeInTheDocument();
        });

        fireEvent.click(screen.getByText("Confirm"));

        await waitFor(() => {
            expect(props.onSuccess).toHaveBeenCalledWith("successful");
        });
    });
    it("should render prop from where dialog is invoked", async () => {
        const { result } = renderHook(() => useDialog());

        act(() => {
            result.current.showDialog(SimpleDialog, props);
        });

        await waitFor(() => {
            expect(screen.getByText("Bar")).toBeInTheDocument();
        });
    });
});
