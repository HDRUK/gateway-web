import { filtersV1, userV1 } from "@/mocks/data";
import { server } from "@/mocks/server";
import useGet from "@/hooks/useGet";
import { getUserV1 } from "@/mocks/handlers/user";
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
    it("should return error if 404 returned", async () => {
        server.use(getUserV1(undefined, 404));

        const { result } = renderHook(() => useGet<User>(apis.usersV1Url));

        expect(result.current).toEqual({
            error: undefined,
            isLoading: true,
            data: undefined,
            mutate: expect.any(Function),
        });

        await waitFor(() => {
            expect(result.current.data).not.toBeDefined();
            expect(result.current.error).toBeDefined();
            expect(result.current.isLoading).toBeFalsy();
        });
    });
});
