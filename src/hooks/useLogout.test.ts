import * as apiService from "@/services/api/get";
import useLogout from "@/hooks/useLogout";
import apis from "@/config/apis";
import mockRouter from "next-router-mock";

import { act } from "react-dom/test-utils";
import { renderHook, waitFor } from "@/utils/testUtils";

mockRouter.push("/initial-path");

jest.mock("@/services/api/get", () => {
    return {
        ...jest.requireActual("@/services/api/get"),
        getRequest: jest.fn(),
        __esModule: true,
    };
});

describe("useLogout", () => {
    it("should logout and redirect", async () => {
        const { result } = renderHook(() => useLogout());

        act(() => {
            result.current();
        });

        await waitFor(() => {
            expect(apiService.getRequest).toBeCalledWith(
                apis.logoutInternalUrl,
                {
                    notificationOptions: {
                        errorNotificationsOn: false,
                    },
                }
            );
            expect(mockRouter).toMatchObject({
                asPath: "/",
                pathname: "/",
                query: {},
            });
        });
    });
});
