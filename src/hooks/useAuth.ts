import apis from "@/config/apis";
import { AuthUser } from "@/interfaces/AuthUser";
import useGet from "./useGet";

interface AuthResponse {
    user: AuthUser | undefined;
    isLoading: boolean;
    isLoggedIn: boolean;
}

const useAuth = (): AuthResponse => {
    const { isLoading, data } = useGet<{
        isLoggedIn: boolean;
        user?: AuthUser;
    }>(apis.authInternalUrl);

    return {
        isLoading,
        user: data?.user,
        isLoggedIn: !!data?.isLoggedIn,
    };
};

export default useAuth;
