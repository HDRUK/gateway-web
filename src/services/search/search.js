import { apiUrlV1, apiUrlV2 } from '../../configs/url.config';
import { getRequest, useMutationWithTranslations, useQueryWithTranslations } from '../../utils/requests';

const getSearch = options => {
    return getRequest(`${apiUrlV1}/search`, options);
};

const getTopic = (topic, options) => {
    return getRequest(`${apiUrlV1}/search/filter/topic/${topic}`, options);
};

const getFilters = (filter, options) => {
    return getRequest(`${apiUrlV2}/filters/${filter}`, options);
};

const getSearchFilters = options => {
    return getRequest(`${apiUrlV1}/search/filter`, options);
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
