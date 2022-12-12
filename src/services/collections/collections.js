import { apiURL } from '../../configs/url.config';
import { getRequest, postRequest, useMutationWithTranslations, useQueryWithTranslations } from '../../utils/requests';

const getCollections = (_id, options) => {
    return getRequest(`${apiURL}/collections/entityid/${_id}`, options);
};

const getCollectionRequest = (_id, options) => {
    return getRequest(`${apiURL}/collections/${_id}`, options);
};

const getCollectionRelatedObjectsRequest = (_id, options) => {
    return getRequest(`${apiURL}/collections/relatedobjects/${_id}`, options);
};

const postCollectionCounterUpdateRequest = (data, options) => {
    return postRequest(`${apiURL}/collectioncounter/update`, data, options);
};

const useGetCollections = (requestOptions, mutateOptions) => {
    return useMutationWithTranslations(_id => getCollections(_id, requestOptions), {
        mutationKey: 'collections.getCollections',
        ...mutateOptions,
    });
};

const useGetCollectionRequest = (_id, requestOptions, queryOptions = { queryKey: 'collections.getCollectionRequest' }) => {
    return useQueryWithTranslations({
        ...queryOptions,
        queryKey: [queryOptions.queryKey, _id],
        queryFn: async ({ queryKey }) => getCollectionRequest(queryKey[1], requestOptions),
    });
};

const useGetCollectionRelatedObjectsRequest = (
    _id,
    requestOptions,
    queryOptions = { queryKey: 'collections.getCollectionRelatedObjectsRequest' }
) => {
    return useQueryWithTranslations({
        ...queryOptions,
        queryKey: [queryOptions.queryKey, _id],
        queryFn: async ({ queryKey }) => getCollectionRelatedObjectsRequest(queryKey[1], requestOptions),
    });
};

const usePostCollectionCounterUpdateRequest = (requestOptions, mutateOptions) => {
    return useMutationWithTranslations(data => postCollectionCounterUpdateRequest(data, requestOptions), {
        mutationKey: 'collections.postCollectionCounterUpdateRequest',
        ...mutateOptions,
    });
};

export default {
    getCollections,
    getCollectionRequest,
    getCollectionRelatedObjectsRequest,
    postCollectionCounterUpdateRequest,
    useGetCollections,
    useGetCollectionRequest,
    useGetCollectionRelatedObjectsRequest,
    usePostCollectionCounterUpdateRequest,
};
