import config from "@/config";
import * as apiService from "@/services/api/post";
import logout from "@/utils/logout";

jest.mock("@/services/api/post", () => {
    return {
        ...jest.requireActual("@/services/api/post"),
        postRequest: jest.fn(),
        __esModule: true,
    };
});

describe("logout", () => {
    it("should call post with correct params", () => {
        logout();
        expect(apiService.postRequest).toBeCalledWith(
            config.logoutV1Url,
            null,
            { notificationOptions: { notificationsOn: false } }
        );
    });
});
