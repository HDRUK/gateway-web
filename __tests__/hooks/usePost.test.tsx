import { filterV1, userV1 } from "@/mocks/data";
import usePost from "@/hooks/usePost";
import { Filter } from "@/interfaces/Filter";
import { User } from "@/interfaces/User";
import vars from "@/config/vars";
import { act, renderHook, waitFor } from "../testUtils";

const mockMutate = jest.fn();

jest.mock("swr", () => {
    return {
        ...jest.requireActual("swr"),
        useSWRConfig: () => ({ mutate: mockMutate }),
        __esModule: true,
    };
});

describe("usePost", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should call mutate with correct arguments for updating a single item", async () => {
        const { result } = renderHook(() => usePost<User>(vars.usersV1Url));
        const { current: createFunction } = result;

        await createFunction(userV1);

        await waitFor(() =>
            expect(mockMutate).toHaveBeenCalledWith(
                vars.usersV1Url,
                expect.any(Function),
                { optimisticData: userV1, rollbackOnError: true }
            )
        );
    });
    it("should call mutate with correct arguments for updating an item in an array", async () => {
        const { result } = renderHook(() => usePost<Filter>(vars.filtersV1Url));
        act(() => {
            result.current(filterV1);
        });

        await waitFor(() => expect(mockMutate).toHaveBeenCalled());
    });
});
