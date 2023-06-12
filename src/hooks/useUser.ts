import { User } from "@/interfaces/User";
import { useContext } from "react";
import { GlobalAuthContext } from "@/providers/Auth/AuthProvider";

interface UserResponse {
    user: User | undefined;
    isLoggedIn: boolean;
}

const useUser = (): UserResponse => {
    const { user, isLoggedIn } = useContext(GlobalAuthContext);

    return {
        isLoggedIn,
        user,
    };
};

export default useUser;
