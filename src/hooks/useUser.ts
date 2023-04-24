import useSWR from "swr";

import { getRequest } from "@/services/api";
import config from "@/config";
import { Error, User } from "@/interfaces";

interface UserResponse {
    user: User | undefined;
    error: Error | undefined;
    isLoading: boolean;
    isLoggedIn: boolean;
}

const useUser = (): UserResponse => {
    const { data, error } = useSWR<User>(
        config.filtersV1Url, // todo: replace with user endpoint once implemented
        getRequest
    );

    return {
        error,
        isLoading: !data && !error,
        isLoggedIn: !!data && !error,
        user: data,
    };
};

export default useUser;
