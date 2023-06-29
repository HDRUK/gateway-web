import apis from "@/config/apis";
import { User } from "@/interfaces/User";
import useGet from "./useGet";

interface AuthResponse {
    user: User | undefined;
    isLoading: boolean;
    isLoggedIn: boolean;
}

const useAuth = (): AuthResponse => {
    const { isLoading, data } = useGet<{
        isLoggedIn: boolean;
        user?: User;
    }>(apis.authInternalUrl);

    return {
        isLoading,
        user: data?.user,
        isLoggedIn: !!data?.isLoggedIn,
    };
};

export default useAuth;
