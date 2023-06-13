import { User } from "@/interfaces/User";
import { useContext } from "react";
import { GlobalAuthContext } from "@/providers/Auth/AuthProvider";

interface AuthResponse {
    user: User | undefined;
    isLoggedIn: boolean;
}

const useAuth = (): AuthResponse => {
    const { user, isLoggedIn } = useContext(GlobalAuthContext);

    return {
        isLoggedIn,
        user,
    };
};

export default useAuth;
