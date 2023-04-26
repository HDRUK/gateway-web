import config from "@/config";
import { Error } from "@/interfaces/Error";
import { User } from "@/interfaces/User";
import useGet from "./useGet";

interface UserResponse {
    user: User | undefined;
    error: Error | undefined;
    isLoading: boolean;
    isLoggedIn: boolean;
}

const useUser = (): UserResponse => {
    const { data, error, isLoading } = useGet<User>(
        config.filtersV1Url // todo: replace with user endpoint once implemented
    );

    return {
        error,
        isLoading,
        isLoggedIn: !!data && !error,
        user: data,
    };
};

export default useUser;
