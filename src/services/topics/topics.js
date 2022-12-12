import { apiURL } from '../../configs/url.config';
import {
    deleteRequest,
    getRequest,
    patchRequest,
    postRequest,
    putRequest,
    useMutationWithTranslations,
    useQueryWithTranslations,
} from '../../utils/requests';

const getTopics = options => {
    return getRequest(`${apiURL}/topics`, options);
};

const getTopic = (_id, options) => {
    return getRequest(`${apiURL}/topics/${_id}`, options);
};

const postTopic = (_id, data, options) => {
    return postRequest(`${apiURL}/topics/${_id}`, data, options);
};

const putTopic = (_id, data, options) => {
    return putRequest(`${apiURL}/topics/${_id}`, data, options);
};

const patchTopic = (_id, data, options) => {
    return patchRequest(`${apiURL}/topics/${_id}`, data, options);
};

const deleteTopic = (_id, options) => {
    return deleteRequest(`${apiURL}/topics/${_id}`, options);
};

const useGetTopics = (requestOptions, queryOptions) => {
    return useQueryWithTranslations({
        queryKey: 'getTopics',
        ...queryOptions,
        queryFn: () => getTopics(requestOptions),
    });
};

const useGetTopic = (requestOptions, queryOptions) => {
    return useQueryWithTranslations({
        queryKey: 'topics.getTopic',
        ...queryOptions,
        queryFn: _id => getTopic(_id, requestOptions),
    });
};

const usePostTopic = (requestOptions, mutateOptions) => {
    return useMutationWithTranslations((_id, data) => postTopic(_id, data, requestOptions), {
        mutationKey: 'topics.postTopic',
        ...mutateOptions,
    });
};

const usePutTopic = (requestOptions, mutateOptions) => {
    return useMutationWithTranslations((_id, data) => putTopic(_id, data, requestOptions), {
        mutationKey: 'topics.putTopic',
        ...mutateOptions,
    });
};

const usePatchTopic = (requestOptions, mutateOptions) => {
    return useMutationWithTranslations((_id, data) => patchTopic(_id, data, requestOptions), {
        mutationKey: 'topics.patchTopic',
        ...mutateOptions,
    });
};

const useDeleteTopic = (requestOptions, queryOptions) => {
    return useQueryWithTranslations({
        queryKey: 'topics.deleteTopic',
        ...queryOptions,
        queryFn: _id => deleteTopic(_id, requestOptions),
    });
};

export default {
    getTopics,
    getTopic,
    postTopic,
    putTopic,
    patchTopic,
    deleteTopic,
    useGetTopics,
    useGetTopic,
    usePostTopic,
    usePutTopic,
    usePatchTopic,
    useDeleteTopic,
};
