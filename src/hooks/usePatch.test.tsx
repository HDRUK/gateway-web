import { User } from "@/interfaces/User";
import usePatch from "@/hooks/usePatch";
import * as apiService from "@/services/api/patch";
import apis from "@/config/apis";
import { renderHook, waitFor } from "@/utils/testUtils";
import { userV1 } from "@/mocks/data";

jest.mock("@/services/api/patch", () => {
    return {
        ...jest.requireActual("@/services/api/patch"),
        patchRequest: jest.fn(),
        __esModule: true,
    };
});

describe("usePatch", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should call patchRequest with correct arguments", async () => {
        const { result } = renderHook(() =>
            usePatch<User>(apis.usersV1Url, {
                localeKey: "mockLocaleKey",
                itemName: "mockItemName",
                query: "queryKey=queryValue",
            })
        );

        await result.current(userV1.id, userV1);

        await waitFor(() =>
            expect(apiService.patchRequest).toHaveBeenCalledWith(
                `${apis.usersV1Url}/${userV1.id}?queryKey=queryValue`,
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
