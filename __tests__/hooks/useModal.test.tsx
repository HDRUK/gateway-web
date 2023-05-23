import useModal from "@/hooks/useModal";
import { act } from "react-dom/test-utils";
import { fireEvent, renderHook, screen, waitFor } from "../testUtils";

describe("useModal", () => {
    it("should render content and title", async () => {
        const { result } = renderHook(() => useModal());

        const props = {
            title: "This is a modal",
            content: "This is modal content",
        };

        act(() => {
            result.current.showModal(props);
        });

        await waitFor(() => {
            expect(screen.getByText(props.title)).toBeInTheDocument();
            expect(screen.getByText(props.content)).toBeInTheDocument();
        });
    });
    it("should render custom button labels", async () => {
        const { result } = renderHook(() => useModal());

        const props = {
            cancelText: "Dismiss",
            confirmText: "Save",
        };

        act(() => {
            result.current.showModal(props);
        });

        await waitFor(() => {
            expect(screen.getByText(props.cancelText)).toBeInTheDocument();
            expect(screen.getByText(props.confirmText)).toBeInTheDocument();
        });
    });
    it("should call cancel if function is passed", async () => {
        const { result } = renderHook(() => useModal());

        const props = {
            title: "This is a modal",
            content: "This is modal content",
            onCancel: jest.fn(),
        };

        act(() => {
            result.current.showModal(props);
        });

        await waitFor(() => {
            expect(screen.getByText(props.title)).toBeInTheDocument();
        });

        fireEvent.click(screen.getByText("Cancel"));

        await waitFor(() => {
            expect(props.onCancel).toHaveBeenCalled();
        });
    });
    it("should call confirm if function is passed", async () => {
        const { result } = renderHook(() => useModal());

        const props = {
            title: "This is a modal",
            content: "This is modal content",
            onSuccess: jest.fn(),
        };

        act(() => {
            result.current.showModal(props);
        });

        await waitFor(() => {
            expect(screen.getByText(props.title)).toBeInTheDocument();
        });

        fireEvent.click(screen.getByText("Confirm"));

        await waitFor(() => {
            expect(props.onSuccess).toHaveBeenCalled();
        });
    });
    it("should call onClose prop when selecting `Close` icon", async () => {
        const { result } = renderHook(() => useModal());

        const props = {
            title: "This is a modal",
            onCancel: jest.fn(),
        };

        act(() => {
            result.current.showModal(props);
        });

        await waitFor(() => {
            expect(screen.getByText(props.title)).toBeInTheDocument();
        });

        fireEvent.click(screen.getByTestId("modal-close-icon"));

        await waitFor(() => {
            expect(props.onCancel).toHaveBeenCalled();
        });
    });
});
