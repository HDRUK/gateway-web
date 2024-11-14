import { useEffect } from "react";
import Cookies from "js-cookie";
import config from "@/config/config";
import { PostLoginActions } from "@/consts/postLoginActions";
import useAuth from "./useAuth";

type PostLoginAction = {
    action: string;
    data: Record<string, number>;
};

type UsePostLoginActionParams = {
    onAction?: (action: PostLoginAction) => void;
};

export default function usePostLoginAction({
    onAction,
}: UsePostLoginActionParams) {
    const { isLoggedIn } = useAuth();

    // Set an action in the cookie for post-login handling
    const setPostLoginActionCookie = (
        action: PostLoginActions,
        data?: Record<string, number>
    ) => {
        const cookieValue = JSON.stringify({ action, ...data });
        Cookies.set(config.POST_LOGIN_ACTION_COOKIE, cookieValue, {
            path: "/",
        });
    };

    // Check for the action cookie upon login, perform action, then clear the cookie
    useEffect(() => {
        const postLoginActionCookie = Cookies.get(
            config.POST_LOGIN_ACTION_COOKIE
        );

        if (postLoginActionCookie && isLoggedIn) {
            if (onAction) {
                const { action, ...data } = JSON.parse(postLoginActionCookie);
                onAction({ action, data });
            }

            Cookies.remove(config.POST_LOGIN_ACTION_COOKIE, { path: "/" });
        }
    }, [isLoggedIn, onAction]);

    return { setPostLoginActionCookie };
}
