import useSWR from "swr";

import { Error, User } from "@/interfaces";
import { apiService } from "@/services";

interface UserResponse {
	user?: User;
	error?: Error;
}

const useUser = (): UserResponse => {
	const { data, error } = useSWR<User>("api/user", apiService.getRequest);

	return {
		error,
		user: data,
	};
};

export default useUser;
