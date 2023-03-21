import { apiUrlV1 } from '../../configs/url.config';
import {
    deleteRequest,
    getRequest,
    patchRequest,
    postRequest,
    putRequest,
    useMutationWithTranslations,
    useQueryWithTranslations,
} from '../../utils/requests';

const getDataAccessRequests = options => {
    return getRequest(`${apiUrlV1}/data-access-request`, options);
};

const getDataAccessRequest = (_id, options) => {
    return getRequest(`${apiUrlV1}/data-access-request/${_id}`, options);
};

const getDatasets = (_id, options) => {
    return getRequest(`${apiUrlV1}/data-access-request/datasets`, options);
};

const postDataAccessRequest = (_id, data, options) => {
    return postRequest(`${apiUrlV1}/data-access-request/${_id}`, data, options);
};

const postRequestAmendments = (_id, data, options) => {
    return postRequest(`${apiUrlV1}/data-access-request/${_id}/requestAmendments`, data, options);
};

const postMessages = (_id, data, options) => {
    return postRequest(`${apiUrlV1}/data-access-request/${_id}/messages`, data, options);
};

const postAmendments = (_id, data, options) => {
    return postRequest(`${apiUrlV1}/data-access-request/${_id}/amendments`, data, options);
};

const postActions = (_id, data, options) => {
    return postRequest(`${apiUrlV1}/data-access-request/${_id}/actions`, data, options);
};

const putDataAccessRequest = (_id, data, options) => {
    return putRequest(`${apiUrlV1}/data-access-request/${_id}`, data, options);
};

const patchDataAccessRequest = (_id, data, options) => {
    return patchRequest(`${apiUrlV1}/data-access-request/${_id}`, data, options);
};

const patchSchema = (_id, data, options) => {
    return patchRequest(`${apiUrlV1}/data-access-request/schema/${_id}`, data, options);
};

const deleteDataAccessRequest = (_id, options) => {
    return deleteRequest(`${apiUrlV1}/data-access-request/${_id}`, options);
};

const useGetDataAccessRequests = (requestOptions, queryOptions) => {
    return useQueryWithTranslations({
        queryKey: 'dar.getDataAccessRequests',
        ...queryOptions,
        queryFn: () => getDataAccessRequests(requestOptions),
    });
};

const useGetDataAccessRequest = (requestOptions, queryOptions) => {
    return useQueryWithTranslations({
        queryKey: 'dar.getDataAccessRequest',
        ...queryOptions,
        queryFn: _id => getDataAccessRequest(_id, requestOptions),
    });
};

const useGetDatasets = (requestOptions, queryOptions) => {
    return useQueryWithTranslations({
        queryKey: 'dar.getDatasets',
        ...queryOptions,
        queryFn: () => getDatasets(requestOptions),
    });
};

const usePostDataAccessRequest = (requestOptions, mutateOptions) => {
    return useMutationWithTranslations((_id, data) => postDataAccessRequest(_id, data, requestOptions), {
        mutationKey: 'dar.postActions',
        ...mutateOptions,
    });
};

const usePostRequestAmendments = (requestOptions, mutateOptions) => {
    return useMutationWithTranslations((_id, data) => postRequestAmendments(_id, data, requestOptions), {
        mutationKey: 'dar.postRequestAmendments',
        ...mutateOptions,
    });
};

const usePostActions = (requestOptions, mutateOptions) => {
    return useMutationWithTranslations((_id, data) => postActions(_id, data, requestOptions), {
        mutationKey: 'dar.postActions',
        ...mutateOptions,
    });
};

const usePostAmendments = (requestOptions, mutateOptions) => {
    return useMutationWithTranslations((_id, data) => postAmendments(_id, data, requestOptions), {
        mutationKey: 'dar.postAmendments',
        ...mutateOptions,
    });
};

const usePostMessages = (requestOptions, mutateOptions) => {
    return useMutationWithTranslations((_id, data) => postMessages(_id, data, requestOptions), {
        mutationKey: 'dar.postMessages',
        ...mutateOptions,
    });
};

const usePutDataAccessRequest = (requestOptions, mutateOptions) => {
    return useMutationWithTranslations((_id, data) => putDataAccessRequest(_id, data, requestOptions), {
        mutationKey: 'dar.putDataAccessRequest',
        ...mutateOptions,
    });
};

const usePatchSchema = (requestOptions, mutateOptions) => {
    return useMutationWithTranslations(
        data => {
            const { id, ...body } = data;

            return patchSchema(id, body, requestOptions);
        },
        {
            mutationKey: 'dar.patchDataAccessSchemaRequest',
            ...mutateOptions,
        }
    );
};

const usePatchDataAccessRequest = (requestOptions, mutateOptions) => {
    return useMutationWithTranslations((_id, data) => patchDataAccessRequest(_id, data, requestOptions), {
        mutationKey: 'dar.patchDataAccessRequest',
        ...mutateOptions,
    });
};

const useDeleteDataAccessRequest = (requestOptions, queryOptions) => {
    return useQueryWithTranslations({
        queryKey: 'dar.deleteDataAccessRequest',
        ...queryOptions,
        queryFn: _id => deleteDataAccessRequest(_id, requestOptions),
    });
};

export {
    getDataAccessRequests,
    getDataAccessRequest,
    getDatasets,
    postDataAccessRequest,
    postRequestAmendments,
    postMessages,
    postActions,
    postAmendments,
    putDataAccessRequest,
    patchDataAccessRequest,
    patchSchema,
    deleteDataAccessRequest,
    useGetDataAccessRequests,
    useGetDataAccessRequest,
    useGetDatasets,
    usePostDataAccessRequest,
    usePostRequestAmendments,
    usePostActions,
    usePostAmendments,
    usePostMessages,
    usePutDataAccessRequest,
    usePatchDataAccessRequest,
    usePatchSchema,
    useDeleteDataAccessRequest,
};
