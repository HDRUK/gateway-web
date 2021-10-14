import { useQuery } from 'react-query';
import { apiURL } from '../configs/url.config';
import { getRequest } from '../utils/requests';

const getReviews = options => {
	return getRequest(`${apiURL}/reviews`, options);
};

const getPending = options => {
	return getRequest(`${apiURL}/reviews/pending`, options);
};

const getAdminPending = options => {
	return getRequest(`${apiURL}/reviews/admin/pending`, options);
};

const useGetReviews = (requestOptions, queryOptions = { queryKey: 'getReviews' }) => {
	return useQuery({
		...queryOptions,
		queryFn: () => getReviews(requestOptions),
	});
};

const useGetPending = (requestOptions, queryOptions = { queryKey: 'getPending' }) => {
	return useQuery({
		...queryOptions,
		queryFn: () => getPending(requestOptions),
	});
};

const useGetAdminPending = (requestOptions, queryOptions = { queryKey: 'getAdminPending' }) => {
	return useQuery({
		...queryOptions,
		queryFn: () => getAdminPending(requestOptions),
	});
};

export default {
	getReviews,
	getAdminPending,
	getPending,
	useGetReviews,
	useGetPending,
	useGetAdminPending,
};
