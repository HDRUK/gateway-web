import useDelete from "@/hooks/useDelete";
import deleteRequest from "@/services/api/delete";
import apis from "@/config/apis";
import { renderHook, waitFor } from "@/utils/testUtils";
import { userV1 } from "@/mocks/data";

jest.mock("@/services/api/delete");

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
            expect(deleteRequest).toHaveBeenCalledWith(
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
