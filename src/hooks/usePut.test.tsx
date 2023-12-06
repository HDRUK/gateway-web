import { userV1 } from "@/mocks/data";
import usePut from "@/hooks/usePut";
import * as apiService from "@/services/api/put";
import { User } from "@/interfaces/User";
import apis from "@/config/apis";
import { renderHook, waitFor } from "@/utils/testUtils";

jest.mock("@/services/api/put", () => {
    return {
        ...jest.requireActual("@/services/api/put"),
        putRequest: jest.fn(),
        __esModule: true,
    };
});

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
            expect(apiService.putRequest).toHaveBeenCalledWith(
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
