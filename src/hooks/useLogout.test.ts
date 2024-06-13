import { act } from "react-dom/test-utils";
import mockRouter from "next-router-mock";
import useLogout from "@/hooks/useLogout";
import getRequest from "@/services/api/get";
import apis from "@/config/apis";
import { renderHook, waitFor } from "@/utils/testUtils";

mockRouter.push("/initial-path");

jest.mock("@/services/api/get");

describe("useLogout", () => {
    it("should logout and redirect", async () => {
        const { result } = renderHook(() => useLogout());

        act(() => {
            result.current();
        });

        await waitFor(() => {
            expect(getRequest).toBeCalledWith(apis.logoutInternalUrl, {
                notificationOptions: {
                    errorNotificationsOn: false,
                    t: expect.any(Function),
                },
            });
            expect(mockRouter).toMatchObject({
                asPath: "/",
                pathname: "/",
                query: {},
            });
        });
    });
});
