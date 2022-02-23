import { useMutation, useQuery } from 'react-query';
import { apiURL } from '../configs/url.config';
import { getRequest, postRequest } from '../utils/requests';

const getLogout = options => {
	return getRequest(`${apiURL}/auth/logout`, options);
};

const postRegister = (data, options) => {
	return postRequest(`${apiURL}/auth/register`, data, options);
};

const useGetStatus = (requestOptions, queryOptions) => {
	return useQuery({
		queryKey: 'getStatus',
		...queryOptions,
		queryFn: () => getStatus(requestOptions),
	});
};

const useGetLogout = (requestOptions, queryOptions) => {
	return useQuery({
		queryKey: 'getLogout',
		...queryOptions,
		queryFn: () => getLogout(requestOptions),
	});
};

const usePostRegister = (requestOptions, mutateOptions) => {
	return useMutation(data => postRegister(data, requestOptions), {
		mutationKey: 'postRegister',
		...mutateOptions,
	});
};

export default {
	getLogout,
	postRegister,
	useGetStatus,
	useGetLogout,
	usePostRegister,
};
