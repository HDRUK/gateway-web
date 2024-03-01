import { User } from "@/interfaces/User";
import usePut from "@/hooks/usePut";
import putRequest from "@/services/api/put";
import apis from "@/config/apis";
import { renderHook, waitFor } from "@/utils/testUtils";
import { userV1 } from "@/mocks/data";

jest.mock("@/services/api/put");

describe("usePut", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should call putRequest with correct arguments", async () => {
        const { result } = renderHook(() =>
            usePut<User>(apis.usersV1Url, {
                localeKey: "mockLocaleKey",
                itemName: "mockItemName",
            })
        );

        await result.current(userV1.id, userV1);

        await waitFor(() =>
            expect(putRequest).toHaveBeenCalledWith(
                `${apis.usersV1Url}/${userV1.id}`,
                userV1,
                {
                    notificationOptions: {
                        action: undefined,
                        errorNotificationsOn: true,
                        itemName: "mockItemName",
                        localeKey: "mockLocaleKey",
                        successNotificationsOn: true,
                        t: expect.any(Function),
                    },
                }
            )
        );
    });
});
