import { filterV1, userV1 } from "@/mocks/data";
import usePut from "@/hooks/usePut";
import { Filter } from "@/interfaces/Filter";
import { User } from "@/interfaces/User";
import apis from "@/config/apis";
import { act, renderHook, waitFor } from "../testUtils";

const mockMutate = jest.fn();

jest.mock("swr", () => {
    return {
        ...jest.requireActual("swr"),
        useSWRConfig: () => ({ mutate: mockMutate }),
        __esModule: true,
    };
});

describe("usePut", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should call mutate with correct arguments for updating a single item", async () => {
        const { result } = renderHook(() => usePut<User>(apis.usersV1Url));
        const { current: createFunction } = result;

        await createFunction(userV1.id, userV1);

        await waitFor(() =>
            expect(mockMutate).toHaveBeenCalledWith(
                apis.usersV1Url,
                expect.any(Function),
                { optimisticData: userV1, rollbackOnError: true }
            )
        );
    });
    it("should call mutate with correct arguments for updating an item in an array", async () => {
        const { result } = renderHook(() => usePut<Filter>(apis.filtersV1Url));
        act(() => {
            result.current(userV1.id, filterV1);
        });

        await waitFor(() => expect(mockMutate).toHaveBeenCalled());
    });
});
