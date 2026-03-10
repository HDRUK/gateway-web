import { AuthUser, TokenClaims } from "@/interfaces/AuthUser";
import useGet from "@/hooks/useGet";
import apis from "@/config/apis";

interface AuthResponse {
    user: AuthUser | undefined;
    claims: TokenClaims | undefined;
    isLoading: boolean;
    isLoggedIn: boolean;
}

const useAuth = (): AuthResponse => {
    const { isLoading, data } = useGet<{
        isLoggedIn: boolean;
        user?: AuthUser;
        claims?: TokenClaims;
    }>(apis.authInternalUrl);

    return {
        isLoading,
        user: data?.user,
        claims: data?.claims,
        isLoggedIn: !!data?.isLoggedIn,
    };
};

export default useAuth;
