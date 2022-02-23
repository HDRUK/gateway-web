import { useQuery } from 'react-query';
import { apiURL } from '../../configs/url.config';
import { getRequest } from '../../utils/requests';

const getLocations = (term, options) => {
	return getRequest(`${apiURL}/locations/${term}`, options);
};

const useGetLocations = (term, requestOptions, queryOptions = { queryKey: 'getLocation' }) => {
	return useQuery({
		...queryOptions,
		queryKey: [queryOptions.queryKey, term],
		queryFn: async ({ queryKey }) => getLocations(queryKey[1], requestOptions),
	});
};

export default {
	getLocations,
	useGetLocations,
};
