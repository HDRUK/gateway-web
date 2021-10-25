import { useQuery } from 'react-query';
import { apiURL } from '../configs/url.config';
import { getRequest } from '../utils/requests';

const getSearch = options => {
	return getRequest(`${apiURL}/search`, options);
};

const getTopic = (topic, options) => {
	return getRequest(`${apiURL}/search/filter/topic/${topic}`, options);
};

const getFilters = (filter, options) => {
	return getRequest(`${apiURL}/search/filters/${filter}`, options);
};

const useGetSearch = (requestOptions, queryOptions = { queryKey: 'getSearch' }) => {
	return useQuery({
		...queryOptions,
		queryFn: () => getSearch(requestOptions),
	});
};

const useGetTopic = (requestOptions, queryOptions = { queryKey: 'getTopic' }) => {
	return useQuery({
		...queryOptions,
		queryFn: () => getTopic(requestOptions),
	});
};

const useGetFilters = (requestOptions, queryOptions = { queryKey: 'getFilters' }) => {
	return useQuery({
		...queryOptions,
		queryFn: () => getFilters(requestOptions),
	});
};

export default {
	getSearch,
	getTopic,
	getFilters,
	useGetSearch,
	useGetTopic,
	useGetFilters,
};
