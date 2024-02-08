import { User } from "@/interfaces/User";
import usePostSwr from "@/hooks/usePostSwr";
import * as apiService from "@/services/api/post";
import apis from "@/config/apis";
import { renderHook, waitFor } from "@/utils/testUtils";

jest.mock("@/services/api/post", () => {
    return {
        ...jest.requireActual("@/services/api/post"),
        postRequest: jest.fn(),
        __esModule: true,
    };
});

describe("usePostSwr", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should call postRequest with correct arguments", async () => {
        renderHook(() =>
            usePostSwr<User>(apis.usersV1Url, {
                localeKey: "mockLocaleKey",
                itemName: "mockItemName",
            })
        );

        await waitFor(() => {
            expect(apiService.postRequest).toHaveBeenCalledWith(
                apis.usersV1Url,
                {
                    localeKey: "mockLocaleKey",
                    itemName: "mockItemName",
                },
                {
                    notificationOptions: {
                        action: undefined,
                        errorNotificationsOn: undefined,
                        successNotificationsOn: false,
                        t: expect.any(Function),
                    },
                    withPagination: false,
                }
            );
        });
    });
});
