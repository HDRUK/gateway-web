import { filterV1, filtersV1 } from "@/mocks/data";
import usePostItem from "@/hooks/usePostItem";
import config from "@/config";
import { renderHook } from "../testUtils";

const mockMutate = jest.fn();

jest.mock("swr", () => {
    return {
        ...jest.requireActual("swr"),
        useSWRConfig: () => ({ mutate: mockMutate }),
    };
});

describe("usePostItem", () => {
    it("should return function to call specified api", async () => {
        const { result } = renderHook(() =>
            usePostItem(config.filtersV1Url, filtersV1)
        );

        await result.current(filterV1);

        expect(mockMutate).toHaveBeenCalledWith(
            config.filtersV1Url,
            expect.any(Function),
            { optimisticData: [...filtersV1, filterV1], rollbackOnError: true }
        );
    });
});
