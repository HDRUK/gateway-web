import { useCohortStatus } from "@/hooks/useCohortStatus";
import { renderHook, act } from "@/utils/testUtils";
import { getCohortStatusAndRedirect } from "../app/actions/getCohortStatusAndRedirectAction";

jest.mock("../app/actions/getCohortStatusAndRedirectAction", () => ({
    getCohortStatusAndRedirect: jest.fn(),
}));

describe("useCohortStatus", () => {
    const mockData = {
        requestStatus: "APPROVED",
        redirectUrl: "https://example.com/redirect",
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should fetch and return cohort data", async () => {
        (getCohortStatusAndRedirect as jest.Mock).mockResolvedValue(mockData);

        const { result } = renderHook(() => useCohortStatus(123));

        expect(result.current.isLoading).toBe(true);
        expect(result.current.requestStatus).toBeNull();
        expect(result.current.redirectUrl).toBeNull();

        // Wait for hook to update after async call
        await act(async () => {
            await Promise.resolve();
        });

        expect(result.current.isLoading).toBe(false);
        expect(result.current.requestStatus).toBe("APPROVED");
        expect(result.current.redirectUrl).toBe("https://example.com/redirect");
    });

    it("should not fetch if userId is undefined", async () => {
        const { result } = renderHook(() => useCohortStatus(undefined));

        await act(async () => {
            await Promise.resolve();
        });

        expect(getCohortStatusAndRedirect).not.toHaveBeenCalled();
        expect(result.current.requestStatus).toBeNull();
    });

    it("should handle fetch failure", async () => {
        (getCohortStatusAndRedirect as jest.Mock).mockRejectedValue(
            new Error("fail")
        );

        const { result } = renderHook(() => useCohortStatus(456));

        await act(async () => {
            await Promise.resolve();
        });

        expect(result.current.isLoading).toBe(false);
        expect(result.current.requestStatus).toBeNull();
        expect(result.current.redirectUrl).toBeNull();
    });
});
