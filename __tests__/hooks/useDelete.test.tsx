import { filtersV1, userV1 } from "@/mocks/data";
import useDelete from "@/hooks/useDelete";
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

describe("useDelete", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should call mutate with correct arguments for deleting the item", async () => {
        const { result } = renderHook(() => useDelete(apis.usersV1Url));
        const { current: deleteFunction } = result;

        await deleteFunction(userV1.id);

        await waitFor(() =>
            expect(mockMutate).toHaveBeenCalledWith(
                apis.usersV1Url,
                expect.any(Function),
                { optimisticData: {}, rollbackOnError: true }
            )
        );
    });
    it("should call mutate with correct arguments for deleting an item in an array", async () => {
        const { result } = renderHook(() => useDelete(apis.filtersV1Url));
        const { current: deleteFunction } = result;

        act(() => {
            deleteFunction(filtersV1[0].id);
        });

        await waitFor(() => expect(mockMutate).toHaveBeenCalled());
    });
});
