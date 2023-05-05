import { filterV1, userV1 } from "@/mocks/data";
import useDelete from "@/hooks/useDelete";
import config from "@/config";
import { Filter } from "@/interfaces/Filter";
import { User } from "@/interfaces/User";
import { act, renderHook, waitFor } from "../testUtils";

const mockMutate = jest.fn();

jest.mock("swr", () => {
    return {
        ...jest.requireActual("swr"),
        useSWRConfig: () => ({ mutate: mockMutate }),
        __esModule: true,
    };
});

describe("useDelete", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should call mutate with correct arguments for deleteing the item", async () => {
        const { result } = renderHook(() => useDelete<User>(config.userV1Url));
        const { current: createFunction } = result;

        await createFunction(userV1);

        await waitFor(() =>
            expect(mockMutate).toHaveBeenCalledWith(
                config.userV1Url,
                expect.any(Function),
                { optimisticData: userV1, rollbackOnError: true }
            )
        );
    });
    it("should call mutate with correct arguments for deleting an item in an array", async () => {
        const { result } = renderHook(() =>
            useDelete<Filter>(config.filtersV1Url)
        );
        act(() => {
            result.current(filterV1);
        });

        await waitFor(() => expect(mockMutate).toHaveBeenCalled());
    });
});
