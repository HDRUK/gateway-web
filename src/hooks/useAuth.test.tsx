import useAuth from "@/hooks/useAuth";
import { renderHook, waitFor } from "@/utils/testUtils";
import { userV1 } from "@/mocks/data";
import { getAuthInternal } from "@/mocks/handlers/auth";
import { server } from "@/mocks/server";

describe("useAuth", () => {
    it("should return the logged in user", async () => {
        const { result } = renderHook(() => useAuth());
        await waitFor(() => {
            expect(result.current).toEqual({
                isLoading: false,
                isLoggedIn: true,
                user: userV1,
            });
        });
    });
    it("should return logged out props", async () => {
        server.use(getAuthInternal(null));
        const { result } = renderHook(() => useAuth());

        await waitFor(() => {
            expect(result.current).toEqual({
                isLoading: false,
                isLoggedIn: false,
                user: undefined,
            });
        });
    });
});
