import { useQuery } from 'react-query';
import { apiURL } from '../configs/url.config';
import { getRequest } from '../utils/requests';

const getSearch = (filter, options) => {
	return getRequest(`${apiURL}/search/filter/${filter}`, options);
};

const useGetSearch = (filter, requestOptions, queryOptions = { queryKey: 'getSearch' }) => {
	return useQuery({
		...queryOptions,
		queryFn: params =>
			getPersons(filter, {
				...requestOptions,
				params,
			}),
	});
};

export default {
	getSearch,
	useGetSearch,
};
