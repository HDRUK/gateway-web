import { userV1 } from "@/mocks/data";
import usePost from "@/hooks/usePost";
import * as apiService from "@/services/api/post";
import { User } from "@/interfaces/User";
import apis from "@/config/apis";
import { renderHook, waitFor } from "@/utils/testUtils";

jest.mock("@/services/api/post", () => {
    return {
        ...jest.requireActual("@/services/api/post"),
        postRequest: jest.fn(),
        __esModule: true,
    };
});

describe("usePost", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should call postRequest with correct arguments", async () => {
        const { result } = renderHook(() =>
            usePost<User>(apis.usersV1Url, {
                localeKey: "mockLocaleKey",
                itemName: "mockItemName",
            })
        );
        const { current: createFunction } = result;

        await createFunction(userV1);

        await waitFor(() =>
            expect(apiService.postRequest).toHaveBeenCalledWith(
                apis.usersV1Url,
                userV1,
                {
                    notificationOptions: {
                        action: undefined,
                        errorNotificationsOn: true,
                        i18n: { changeLanguage: expect.any(Function) },
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
