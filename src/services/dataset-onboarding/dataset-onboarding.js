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

const getDatasetOnboardings = options => {
    return getRequest(`${apiURL}/dataset-onboarding`, options);
};

const getDatasetOnboarding = (_id, options) => {
    return getRequest(`${apiURL}/dataset-onboarding/${_id}`, options);
};

const getPublisher = (_id, options) => {
    return getRequest(`${apiURL}/dataset-onboarding/publisher/${_id}`, options);
};

const postDatasetOnboarding = (data, options) => {
    return postRequest(`${apiURL}/dataset-onboarding`, data, options);
};

const postDuplicate = (_id, data, options) => {
    return postRequest(`${apiURL}/dataset-onboarding/duplicate/${_id}`, data, options);
};

const putDatasetOnboarding = (_id, data, options) => {
    return putRequest(`${apiURL}/dataset-onboarding/${_id}`, data, options);
};

const patchDatasetOnboarding = (_id, data, options) => {
    return patchRequest(`${apiURL}/dataset-onboarding/${_id}`, data, options);
};

const deleteDatasetOnboarding = (_id, options) => {
    return deleteRequest(`${apiURL}/dataset-onboarding/delete/${_id}`, options);
};

const useGetDatasetOnboardings = (requestOptions, queryOptions) => {
    return useQueryWithTranslations({
        queryKey: 'getDatasetOnboardings',
        ...queryOptions,
        queryFn: () => getDatasetOnboardings(requestOptions),
    });
};

const useGetDatasetOnboarding = (requestOptions, queryOptions) => {
    return useQueryWithTranslations({
        queryKey: 'getDatasetOnboarding',
        ...queryOptions,
        queryFn: _id => getDatasetOnboarding(_id, requestOptions),
    });
};

const useGetPublisher = (publisherId, requestOptions, mutateOptions) => {
    const _id = Array.isArray(publisherId) ? publisherId[0] : publisherId;

    return useMutationWithTranslations(params => getPublisher(_id, { params }, requestOptions), {
        mutationKey: 'getPublisher',
        ...mutateOptions,
    });
};

const usePostDatasetOnboarding = (requestOptions, mutateOptions) => {
    return useMutationWithTranslations(data => postDatasetOnboarding(data, requestOptions), {
        mutationKey: 'postDatasetOnboarding',
        ...mutateOptions,
    });
};

const usePostDuplicate = (requestOptions, mutateOptions) => {
    return useMutationWithTranslations((_id, data) => postDuplicate(_id, data, requestOptions), {
        mutationKey: 'postDuplicate',
        ...mutateOptions,
    });
};

const usePutDatasetOnboarding = (requestOptions, mutateOptions) => {
    return useMutationWithTranslations((_id, data) => putDatasetOnboarding(_id, data, requestOptions), {
        mutationKey: 'putDatasetOnboarding',
        ...mutateOptions,
    });
};

const usePatchDatasetOnboarding = (requestOptions, mutateOptions) => {
    return useMutationWithTranslations((_id, data) => patchDatasetOnboarding(_id, data, requestOptions), {
        mutationKey: 'patchDatasetOnboarding',
        ...mutateOptions,
    });
};

const useDeleteDatasetOnboarding = (requestOptions, queryOptions) => {
    return useMutationWithTranslations({
        queryKey: 'deleteDatasetOnboarding',
        ...queryOptions,
        queryFn: _id => deleteDatasetOnboarding(_id, requestOptions),
    });
};

export default {
    getDatasetOnboardings,
    getDatasetOnboarding,
    getPublisher,
    postDatasetOnboarding,
    postDuplicate,
    putDatasetOnboarding,
    patchDatasetOnboarding,
    deleteDatasetOnboarding,
    useGetDatasetOnboardings,
    useGetDatasetOnboarding,
    useGetPublisher,
    usePostDatasetOnboarding,
    usePostDuplicate,
    usePutDatasetOnboarding,
    usePatchDatasetOnboarding,
    useDeleteDatasetOnboarding,
};
