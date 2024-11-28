import Cookies from "js-cookie";
import config from "@/config/config";
import { PostLoginActions } from "@/consts/postLoginActions";
import { act, renderHook, waitFor } from "@/utils/testUtils";
import usePostLoginAction from "./usePostLoginAction";

jest.mock("js-cookie");

jest.mock("@/hooks/useAuth", () => ({
    __esModule: true,
    default: () => ({ isLoggedIn: true }),
}));

describe("usePostLoginAction", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should set the cookie with the action and data", async () => {
        const { result } = renderHook(() => usePostLoginAction({}));

        act(() => {
            result.current.setPostLoginActionCookie(
                PostLoginActions.ADD_LIBRARY,
                {
                    datasetId: 40,
                }
            );
        });

        await waitFor(() => {
            expect(Cookies.set).toHaveBeenCalledWith(
                config.POST_LOGIN_ACTION_COOKIE,
                JSON.stringify({
                    action: PostLoginActions.ADD_LIBRARY,
                    datasetId: 40,
                }),
                {
                    path: "/",
                }
            );
        });
    });

    it("should execute the action after login", async () => {
        const datasetId = 50;
        const mockOnAction = jest.fn();

        const mockPostLoginActionCookie = JSON.stringify({
            action: PostLoginActions.ADD_LIBRARY,
            datasetId,
        });

        (Cookies.get as jest.Mock).mockReturnValue(mockPostLoginActionCookie);

        renderHook(() =>
            usePostLoginAction({
                onAction: mockOnAction,
            })
        );

        // Wait for the effect to run and the action to be executed
        await waitFor(() => {
            expect(mockOnAction).toHaveBeenCalledWith({
                action: PostLoginActions.ADD_LIBRARY,
                data: { datasetId },
            });
        });
    });
});
