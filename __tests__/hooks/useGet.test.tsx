import { filtersV1, userV1 } from "@/mocks/data";
import useGet from "@/hooks/useGet";
import { User } from "@/interfaces/User";
import { Filter } from "@/interfaces/Filter";
import apis from "@/config/apis";
import { renderHook, waitFor } from "../testUtils";

describe("useGet", () => {
    it("should eventually return the single item", async () => {
        const { result } = renderHook(() => useGet<User>(apis.usersV1Url));

        expect(result.current).toEqual({
            error: undefined,
            isLoading: true,
            data: undefined,
            mutate: expect.any(Function),
        });

        await waitFor(() => {
            expect(result.current.error).not.toBeDefined();
            expect(result.current.data).toEqual(userV1);
        });
    });
    it("should eventually return the list", async () => {
        const { result } = renderHook(() =>
            useGet<Filter[]>(apis.filtersV1Url)
        );

        expect(result.current).toEqual({
            error: undefined,
            isLoading: true,
            data: undefined,
            mutate: expect.any(Function),
        });

        await waitFor(() => {
            expect(result.current.error).not.toBeDefined();
            expect(result.current.data).toEqual(filtersV1);
        });
    });
});
