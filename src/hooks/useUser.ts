import useSWR from "swr";

import { Error, User } from "@/interfaces";
import { apiService } from "@/services";
import config from "@/config";

interface UserResponse {
    user: User | undefined;
    error: Error | undefined;
    isLoading: boolean;
    isLoggedIn: boolean;
}

const useUser = (): UserResponse => {
    const { data, error } = useSWR<User>(
        config.tagsV1Url, // todo: replace with user endpoint once implemented
        apiService.getRequest
    );

    return {
        error,
        isLoading: !data && !error,
        isLoggedIn: !!data && !error,
        user: data,
    };
};

export default useUser;
