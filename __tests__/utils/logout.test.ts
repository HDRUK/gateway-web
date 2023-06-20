import * as apiService from "@/services/api/post";
import logout from "@/utils/logout";
import vars from "@/config/vars";

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
        expect(apiService.postRequest).toBeCalledWith(vars.logoutV1Url, null, {
            notificationOptions: { notificationsOn: false },
        });
    });
});
