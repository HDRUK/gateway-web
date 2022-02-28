import { apiURL } from '../../configs/url.config';
import { getRequest, useQueryWithTranslations } from '../../utils/requests';

const getLocations = (term, options) => {
    return getRequest(`${apiURL}/locations/${term}`, options);
};

const useGetLocations = (term, requestOptions, queryOptions = { queryKey: 'locations.getLocation' }) => {
    return useQueryWithTranslations({
        ...queryOptions,
        queryKey: [queryOptions.queryKey, term],
        queryFn: async ({ queryKey }) => getLocations(queryKey[1], requestOptions),
    });
};

export default {
    getLocations,
    useGetLocations,
};
