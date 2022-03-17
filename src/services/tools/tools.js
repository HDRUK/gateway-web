import { apiURL, apiV2URL } from '../../configs/url.config';
import {
    deleteRequest,
    getRequest,
    patchRequest,
    postRequest,
    putRequest,
    useMutationWithTranslations,
    useQueryWithTranslations,
} from '../../utils/requests';

const getTools = options => {
    return getRequest(`${apiV2URL}/tools`, options);
};

const getTool = (_id, options) => {
    return getRequest(`${apiURL}/tools/${_id}`, options);
};

const getToolEdit = (_id, options) => {
    return getRequest(`${apiURL}/tools/edit/${_id}`, options);
};

const getProjectTag = (_id, options) => {
    return getRequest(`${apiURL}/tools/project/tag/${_id}`, options);
};

const postTool = (_id, data, options) => {
    return postRequest(`${apiURL}/tools/${_id}`, data, options);
};

const postReviewAdd = (data, options) => {
    return postRequest(`${apiURL}/tools/review/add`, data, options);
};

const postToolsReply = (data, options) => {
    return postRequest(`${apiURL}/tools/reply`, data, options);
};

const putTool = (_id, data, options) => {
    return putRequest(`${apiURL}/tools/${_id}`, data, options);
};

const putReviewApprove = (data, options) => {
    return putRequest(`${apiURL}/tools/review/approve`, data, options);
};

const patchTool = (_id, data, options) => {
    return patchRequest(`${apiURL}/tools/${_id}`, data, options);
};

const deleteTool = (_id, options) => {
    return deleteRequest(`${apiURL}/tools/${_id}`, options);
};

const useGetTools = (requestOptions, mutateOptions) => {
    return useMutationWithTranslations(
        params =>
            getTools({
                ...requestOptions,
                ...params,
            }),
        {
            mutationKey: 'tools.getTools',
            ...mutateOptions,
        }
    );
};

const useGetTool = (requestOptions, queryOptions) => {
    return useQueryWithTranslations({
        queryKey: 'tools.getTool',
        ...queryOptions,
        queryFn: _id => getTool(_id, requestOptions),
    });
};

const useGetToolEdit = (requestOptions, queryOptions) => {
    return useQueryWithTranslations({
        queryKey: 'tools.getToolEdit',
        ...queryOptions,
        queryFn: _id => getToolEdit(_id, requestOptions),
    });
};

const useGetProjectTag = (requestOptions, queryOptions) => {
    return useQueryWithTranslations({
        queryKey: 'tools.getProjectTag',
        ...queryOptions,
        queryFn: _id => getProjectTag(_id, requestOptions),
    });
};

const usePostTool = (requestOptions, mutateOptions) => {
    return useMutationWithTranslations((_id, data) => postTool(_id, data, requestOptions), {
        mutationKey: 'tools.postTool',
        ...mutateOptions,
    });
};

const usePostReviewAdd = (requestOptions, mutateOptions) => {
    return useMutationWithTranslations(data => postReviewAdd(data, requestOptions), {
        mutationKey: 'tools.postReviewAdd',
        ...mutateOptions,
    });
};

const usePostToolsReply = (requestOptions, mutateOptions) => {
    return useMutationWithTranslations(data => postToolsReply(data, requestOptions), {
        mutationKey: 'tools.postToolsReply',
        ...mutateOptions,
    });
};

const usePutTool = (requestOptions, mutateOptions) => {
    return useMutationWithTranslations((_id, data) => putTool(_id, data, requestOptions), {
        mutationKey: 'tools.putTool',
        ...mutateOptions,
    });
};

const usePutReviewApprove = (requestOptions, mutateOptions) => {
    return useMutationWithTranslations(data => putReviewApprove(data, requestOptions), {
        mutationKey: 'tools.putReviewApprove',
        ...mutateOptions,
    });
};

const usePatchTool = (requestOptions, mutateOptions) => {
    return useMutationWithTranslations((_id, data) => patchTool(_id, data, requestOptions), {
        mutationKey: 'tools.patchTool',
        ...mutateOptions,
    });
};

const useDeleteTool = (requestOptions, queryOptions) => {
    return useQueryWithTranslations({
        queryKey: 'tools.deleteTool',
        ...queryOptions,
        queryFn: _id => deleteTool(_id, requestOptions),
    });
};

export default {
    getTools,
    getTool,
    getToolEdit,
    getProjectTag,
    postTool,
    postReviewAdd,
    postToolsReply,
    putTool,
    putReviewApprove,
    patchTool,
    deleteTool,
    useGetTools,
    useGetTool,
    useGetToolEdit,
    useGetProjectTag,
    usePostTool,
    usePostReviewAdd,
    usePostToolsReply,
    usePutTool,
    usePutReviewApprove,
    usePatchTool,
    useDeleteTool,
};
