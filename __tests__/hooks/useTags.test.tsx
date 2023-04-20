import useTags from "@/hooks/useTags";
import { tagsV1 } from "@/mocks/data";
import { server } from "@/mocks/server";
import { getTagsV1 } from "@/mocks/handlers/tags";
import { renderHook, waitFor } from "../testUtils";

describe("useTags", () => {
    it("should eventually return the tags", async () => {
        const { result } = renderHook(() => useTags());

        expect(result.current).toEqual({
            error: undefined,
            isLoading: true,
            tags: undefined,
        });

        await waitFor(() => {
            expect(result.current.error).not.toBeDefined();
            expect(result.current.tags).toEqual(tagsV1);
        });
    });
    it("should return error if 404 returned", async () => {
        server.use(getTagsV1(undefined, 404));

        const { result } = renderHook(() => useTags());

        expect(result.current).toEqual({
            error: undefined,
            isLoading: true,
            tags: undefined,
        });

        await waitFor(() => {
            expect(result.current.tags).not.toBeDefined();
            expect(result.current.error).toBeDefined();
            expect(result.current.isLoading).toBeFalsy();
        });
    });
});
