import useUser from "@/hooks/useUser";
import { filtersV1 } from "@/mocks/data";
import { server } from "@/mocks/server";
import { getFiltersV1 } from "@/mocks/handlers/filters";
import { renderHook, waitFor } from "../testUtils";

/**
 * todo: Needs updating once api/user endpoint is implemented
 */
describe("useUser", () => {
    it("should eventually return the user", async () => {
        const { result } = renderHook(() => useUser());

        expect(result.current).toEqual({
            error: undefined,
            isLoading: true,
            isLoggedIn: false,
            user: undefined,
        });

        await waitFor(() => {
            expect(result.current.error).not.toBeDefined();
            expect(result.current.user).toEqual(filtersV1);
        });
    });
    it("should return error if 404 returned", async () => {
        server.use(getFiltersV1(undefined, 404));

        const { result } = renderHook(() => useUser());

        expect(result.current).toEqual({
            error: undefined,
            isLoading: true,
            isLoggedIn: false,
            user: undefined,
        });

        await waitFor(() => {
            expect(result.current.user).not.toBeDefined();
            expect(result.current.error).toBeDefined();
            expect(result.current.isLoading).toBeFalsy();
            expect(result.current.isLoggedIn).toBeFalsy();
        });
    });
});
