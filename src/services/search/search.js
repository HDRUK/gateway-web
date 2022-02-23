import { useQuery } from 'react-query';
import { apiURL } from '../../configs/url.config';
import { getRequest, useMutationWithTranslations } from '../../utils/requests';

const getSearch = options => {
	return getRequest(`${apiURL}/search`, options);
};

const getTopic = (topic, options) => {
	return getRequest(`${apiURL}/search/filter/topic/${topic}`, options);
};

const getFilters = (filter, options) => {
	return getRequest(`${apiURL}/search/filters/${filter}`, options);
};

const useGetSearch = (requestOptions, mutateOptions) => {
	return useMutationWithTranslations(
		params =>
			getSearch({
				...requestOptions,
				...params,
			}),
		{
			mutationKey: 'getSearch',
			...mutateOptions,
		}
	);
};

const useGetTopic = (requestOptions, queryOptions) => {
	return useQuery({
		queryKey: 'getTopic',
		...queryOptions,
		queryFn: () => getTopic(requestOptions),
	});
};

const useGetFilters = (requestOptions, queryOptions) => {
	return useQuery({
		queryKey: 'getFilters',
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
