import useNavigationProgress from "@/hooks/useNavigationProgress";
import { PROGRESS_END_EVENT, PROGRESS_START_EVENT } from "@/consts/navigation";
import { renderHook } from "@/utils/testUtils";

describe("useNavigationProgress", () => {
    const started = jest.fn();
    const ended = jest.fn();

    beforeEach(() => {
        window.addEventListener(PROGRESS_START_EVENT, started);
        window.addEventListener(PROGRESS_END_EVENT, ended);
    });

    afterEach(() => {
        window.removeEventListener(PROGRESS_START_EVENT, started);
        window.removeEventListener(PROGRESS_END_EVENT, ended);
        jest.clearAllMocks();
    });

    it("starts and ends progress with the loading state", () => {
        let isLoading = false;
        const { rerender } = renderHook(() => useNavigationProgress(isLoading));

        expect(started).not.toHaveBeenCalled();

        isLoading = true;
        rerender();
        expect(started).toHaveBeenCalledTimes(1);

        isLoading = false;
        rerender();
        expect(ended).toHaveBeenCalledTimes(1);
        expect(ended.mock.calls[0][0].detail).toBe(
            started.mock.calls[0][0].detail
        );
    });

    it("ends progress when unmounted mid-load", () => {
        const { unmount } = renderHook(() => useNavigationProgress(true));

        unmount();

        expect(ended).toHaveBeenCalledTimes(1);
    });
});
