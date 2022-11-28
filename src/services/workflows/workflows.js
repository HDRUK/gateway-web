import { apiUrlV1 } from '../../configs/url.config';
import { deleteRequest, postRequest, putRequest, useMutationWithTranslations, useQueryWithTranslations } from '../../utils/requests';

const postWorkflow = (data, options) => {
    return postRequest(`${apiUrlV1}/workflows`, data, options);
};

const putWorkflow = (_id, data, options) => {
    return putRequest(`${apiUrlV1}/workflows/${_id}`, data, options);
};

const deleteWorkflow = (_id, options) => {
    return deleteRequest(`${apiUrlV1}/workflows/${_id}`, options);
};

const usePostWorkflow = (requestOptions, mutateOptions) => {
    return useMutationWithTranslations(data => postWorkflow(data, requestOptions), {
        mutationKey: 'workflows.postWorkflow',
        ...mutateOptions,
    });
};

const usePutWorkflow = (requestOptions, mutateOptions) => {
    return useMutationWithTranslations((_id, data) => putWorkflow(_id, data, requestOptions), {
        mutationKey: 'workflows.putWorkflow',
        ...mutateOptions,
    });
};

export const useDeleteWorkflow = (requestOptions, queryOptions) => {
    return useQueryWithTranslations({
        queryKey: 'workflows.deleteWorkflow',
        ...queryOptions,
        queryFn: _id => deleteWorkflow(_id, requestOptions),
    });
};

export default {
    postWorkflow,
    putWorkflow,
    deleteWorkflow,
    usePostWorkflow,
    usePutWorkflow,
    useDeleteWorkflow,
};
