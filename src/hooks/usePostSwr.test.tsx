import { act } from "@testing-library/react";
import { User } from "@/interfaces/User";
import usePostSwr from "@/hooks/usePostSwr";
import apiService from "@/services/api";
import postRequest from "@/services/api/post";
import apis from "@/config/apis";
import { renderHook, waitFor } from "@/utils/testUtils";
import { userV1 } from "@/mocks/data";

jest.mock("@/services/api/post");
jest.mock("@/services/api", () => ({
    __esModule: true,
    default: { postRequest: jest.fn() },
}));

const mockPostRequest = apiService.postRequest as jest.Mock;

const searchResults = { list: [{ id: 1 }], lastPage: 1 };

const flush = async (ms: number) => {
    await act(async () => {
        await jest.advanceTimersByTimeAsync(ms);
    });
};

describe("usePostSwr", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it.skip("should call postRequest with correct arguments", async () => {
        renderHook(() =>
            usePostSwr<User>(apis.usersV1Url, userV1, {
                localeKey: "mockLocaleKey",
                itemName: "mockItemName",
            })
        );

        await waitFor(() => {
            expect(postRequest).toHaveBeenCalledWith(apis.usersV1Url, userV1, {
                localeKey: "mockLocaleKey",
                itemName: "mockItemName",
                notificationOptions: {
                    action: undefined,
                    errorNotificationsOn: undefined,
                    successNotificationsOn: false,
                    t: expect.any(Function),
                },
                withPagination: false,
            });
        });
    });

    describe("when the request fails", () => {
        beforeEach(() => {
            jest.useFakeTimers();
            mockPostRequest.mockReset();
        });

        afterEach(() => {
            jest.useRealTimers();
        });

        it("retries rather than caching the empty response the api service returns", async () => {
            // the api service swallows http errors and resolves null
            mockPostRequest
                .mockResolvedValueOnce(null)
                .mockResolvedValue(searchResults);

            const { result } = renderHook(() =>
                usePostSwr(apis.searchV2AggregationUrl, { query: "asthma" })
            );

            await flush(100);
            await flush(30000);

            expect(mockPostRequest.mock.calls.length).toBeGreaterThan(1);
            expect(result.current.data).toEqual(searchResults);
        });

        it("surfaces an error instead of resolving undefined data", async () => {
            mockPostRequest.mockResolvedValue(null);

            const { result } = renderHook(() =>
                usePostSwr(apis.searchV2AggregationUrl, { query: "asthma" })
            );

            await flush(100);

            expect(result.current.data).toBeUndefined();
            expect(result.current.error).toBeDefined();
        });

        it("does not retry a request that succeeds", async () => {
            mockPostRequest.mockResolvedValue(searchResults);

            const { result } = renderHook(() =>
                usePostSwr(apis.searchV2AggregationUrl, { query: "asthma" })
            );

            await flush(100);
            await flush(30000);

            expect(mockPostRequest).toHaveBeenCalledTimes(1);
            expect(result.current.data).toEqual(searchResults);
        });
    });
});
