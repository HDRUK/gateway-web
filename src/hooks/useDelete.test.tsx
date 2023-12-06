import { userV1 } from "@/mocks/data";
import useDelete from "@/hooks/useDelete";
import * as apiService from "@/services/api/delete";
import apis from "@/config/apis";
import { renderHook, waitFor } from "@/utils/testUtils";

jest.mock("@/services/api/delete", () => {
    return {
        ...jest.requireActual("@/services/api/delete"),
        deleteRequest: jest.fn(),
        __esModule: true,
    };
});

describe("useDelete", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should call deleteRequest with correct arguments for deleting the item", async () => {
        const { result } = renderHook(() =>
            useDelete(apis.usersV1Url, {
                localeKey: "mockLocaleKey",
                itemName: "mockItemName",
            })
        );
        const { current: deleteFunction } = result;

        await deleteFunction(userV1.id);

        await waitFor(() =>
            expect(apiService.deleteRequest).toHaveBeenCalledWith(
                `${apis.usersV1Url}/${userV1.id}`,
                {
                    notificationOptions: {
                        localeKey: "mockLocaleKey",
                        itemName: "mockItemName",
                        t: expect.any(Function),
                        action: undefined,
                    },
                }
            )
        );
    });
});
