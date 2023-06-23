import * as apiService from "@/services/api/get";
import useLogout from "@/hooks/useLogout";
import vars from "@/config/vars";

import { act } from "react-dom/test-utils";
import { useRouter } from "next/router";
import { renderHook, waitFor } from "../testUtils";

const pushMock = jest.fn();

useRouter.mockReturnValue({
    query: {},
    push: pushMock,
});

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
                vars.logoutInternalUrl,
                {
                    notificationOptions: { notificationsOn: false },
                }
            );
            expect(pushMock).toBeCalledWith("/");
        });
    });
});
