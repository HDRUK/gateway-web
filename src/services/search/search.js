import { apiURL, apiV2URL } from '../../configs/url.config';
import { getRequest, useMutationWithTranslations, useQueryWithTranslations } from '../../utils/requests';

const getSearch = options => {
    return getRequest(`${apiURL}/search`, options);
};

const getTopic = (topic, options) => {
    return getRequest(`${apiURL}/search/filter/topic/${topic}`, options);
};

const getFilters = (filter, options) => {
    return getRequest(`${apiV2URL}/filters/${filter}`, options);
};

const getSearchFilters = options => {
    return getRequest(`${apiURL}/search/filter`, options);
};

const useGetSearch = (requestOptions, mutateOptions) => {
    return useMutationWithTranslations(
        params =>
            getSearch({
                ...requestOptions,
                ...params,
            }),
        {
            mutationKey: 'search.getSearch',
            ...mutateOptions,
        }
    );
};

const useGetTopic = (requestOptions, queryOptions) => {
    return useQueryWithTranslations({
        queryKey: 'search.getTopic',
        ...queryOptions,
        queryFn: () => getTopic(requestOptions),
    });
};

const useGetFilters = (requestOptions, queryOptions) => {
    return useQueryWithTranslations({
        queryKey: 'search.getFilters',
        ...queryOptions,
        queryFn: () => getFilters(requestOptions),
    });
};

const useGetSearchFilters = (requestOptions, queryOptions) => {
    return useQueryWithTranslations({
        queryKey: 'search.getSearchFilters',
        ...queryOptions,
        queryFn: () => getSearchFilters(requestOptions),
    });
};

export default {
    getSearch,
    getTopic,
    getFilters,
    getSearchFilters,
    useGetSearch,
    useGetTopic,
    useGetFilters,
    useGetSearchFilters,
};
