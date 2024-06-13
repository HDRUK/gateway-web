import { User } from "@/interfaces/User";
import usePostSwr from "@/hooks/usePostSwr";
import postRequest from "@/services/api/post";
import apis from "@/config/apis";
import { renderHook, waitFor } from "@/utils/testUtils";
import { userV1 } from "@/mocks/data";

jest.mock("@/services/api/post");

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
});
