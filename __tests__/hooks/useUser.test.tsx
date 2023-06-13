import { userV1 } from "@/mocks/data";
import useAuth from "@/hooks/useAuth";
import { renderHook } from "../testUtils";

describe("useAuth", () => {
    it("should return the logged in user", () => {
        const { result } = renderHook(() => useAuth());

        expect(result.current.isLoggedIn).toBeTruthy();
        expect(result.current.user).toEqual(userV1);
    });
    it("should return logged out props", () => {
        const { result } = renderHook(() => useAuth(), {
            wrapperProps: { user: null },
        });

        expect(result.current).toEqual({
            isLoggedIn: false,
            user: null,
        });
    });
});
