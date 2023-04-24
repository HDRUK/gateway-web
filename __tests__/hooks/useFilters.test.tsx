import { filtersV1 } from "@/mocks/data";
import { server } from "@/mocks/server";
import { getFiltersV1 } from "@/mocks/handlers/filters";
import useFilters from "@/hooks/useFilters";
import { renderHook, waitFor } from "../testUtils";

describe("useFilters", () => {
    it("should eventually return the filters", async () => {
        const { result } = renderHook(() => useFilters());

        expect(result.current).toEqual({
            error: undefined,
            isLoading: true,
            filters: undefined,
            mutate: expect.any(Function),
        });

        await waitFor(() => {
            expect(result.current.error).not.toBeDefined();
            expect(result.current.filters).toEqual(filtersV1);
        });
    });
    it("should return error if 404 returned", async () => {
        server.use(getFiltersV1(undefined, 404));

        const { result } = renderHook(() => useFilters());

        expect(result.current).toEqual({
            error: undefined,
            isLoading: true,
            filters: undefined,
            mutate: expect.any(Function),
        });

        await waitFor(() => {
            expect(result.current.filters).not.toBeDefined();
            expect(result.current.error).toBeDefined();
            expect(result.current.isLoading).toBeFalsy();
        });
    });
});
