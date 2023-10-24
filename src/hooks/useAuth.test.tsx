import { userV1 } from "@/mocks/data";
import useAuth from "@/hooks/useAuth";
import { server } from "@/mocks/server";
import { getAuthInternal } from "@/mocks/handlers/auth";
import { renderHook, waitFor } from "@/utils/testUtils";

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
