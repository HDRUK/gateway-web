import { useEffect } from "react";
import Cookies from "js-cookie";
import useAuth from "./useAuth";

type PostLoginAction = {
    action: string;
    data: Record<string, number>;
};

type UsePostLoginActionParams = {
    cookieName: string;
    onAction: (action: PostLoginAction) => void;
};

export default function usePostLoginAction({
    cookieName,
    onAction,
}: UsePostLoginActionParams) {
    const { isLoggedIn } = useAuth();

    // Set an action in the cookie for post-login handling
    const setPostLoginActionCookie = (
        action: string,
        data?: Record<string, number>
    ) => {
        const cookieValue = JSON.stringify({ action, ...data });
        Cookies.set(cookieName, cookieValue, { path: "/" });
    };

    // Check for the action cookie upon login, perform action, then clear the cookie
    useEffect(() => {
        const postLoginActionCookie = Cookies.get(cookieName);
        if (postLoginActionCookie && isLoggedIn) {
            const { action, ...data } = JSON.parse(postLoginActionCookie);
            onAction({ action, data });
            Cookies.remove(cookieName, { path: "/" });
        }
    }, [cookieName, isLoggedIn, onAction]);

    return { setPostLoginActionCookie };
}
