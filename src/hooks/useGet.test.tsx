import { Filter } from "@/interfaces/Filter";
import { User } from "@/interfaces/User";
import useGet from "@/hooks/useGet";
import apis from "@/config/apis";
import { renderHook, waitFor } from "@/utils/testUtils";
import { filtersV1, userV1 } from "@/mocks/data";

describe("useGet", () => {
    it("should eventually return the single item", async () => {
        const { result } = renderHook(() => useGet<User>(apis.usersV1Url));

        expect(result.current).toEqual({
            isLoading: true,
            data: undefined,
            mutate: expect.any(Function),
        });

        await waitFor(() => {
            expect(result.current.data).toEqual(userV1);
        });
    });
    it("should eventually return the list", async () => {
        const { result } = renderHook(() =>
            useGet<Filter[]>(apis.filtersV1Url)
        );

        expect(result.current).toEqual({
            isLoading: true,
            data: undefined,
            mutate: expect.any(Function),
        });

        await waitFor(() => {
            expect(result.current.data).toEqual(filtersV1);
        });
    });
});
