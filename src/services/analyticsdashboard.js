import { useQuery } from 'react-query';
import { apiURL } from '../configs/url.config';
import { getRequest } from '../utils/requests';

const getTotalUsers = options => {
	return getRequest(`${apiURL}/analyticsdashboard/totalusers`, options);
};

const getUsersPerMonth = options => {
	return getRequest(`${apiURL}/analyticsdashboard/userspermonth`, options);
};

const useGetTotalUsers = (requestOptions, queryOptions = { queryKey: 'getTotalUsers' }) => {
	return useQuery({
		...queryOptions,
		queryFn: () => getTotalUsers(requestOptions),
	});
};

const useGetUsersPerMonth = (requestOptions, queryOptions = { queryKey: 'getUsersPerMonth' }) => {
	return useQuery({
		...queryOptions,
		queryFn: () => getUsersPerMonth(requestOptions),
	});
};

export default {
	getTotalUsers,
	getUsersPerMonth,
	useGetTotalUsers,
	useGetUsersPerMonth,
};
