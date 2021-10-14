import { useMutation, useQuery } from 'react-query';
import { apiURL } from '../configs/url.config';
import { getRequest, postRequest } from '../utils/requests';

const getLogout = options => {
	return getRequest(`${apiURL}/auth/logout`, options);
};

const postRegister = (data, options) => {
	return postRequest(`${apiURL}/auth/register`, data, options);
};

const useGetLogout = (requestOptions, queryOptions = { queryKey: 'getLogout' }) => {
	return useQuery({
		...queryOptions,
		queryFn: () => getLogout(requestOptions),
	});
};

const usePostRegister = (requestOptions, mutateOptions = { queryKey: 'postRegister' }) => {
	return useMutation(data => postRegister(data, requestOptions), {
		mutateOptions,
	});
};

export default {
	getLogout,
	postRegister,
	useGetLogout,
	usePostRegister,
};
