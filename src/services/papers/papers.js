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

const getPapers = options => {
    return getRequest(`${apiV2URL}/papers`, options);
};

const getPaper = (_id, options) => {
    return getRequest(`${apiURL}/papers/${_id}`, options);
};

const getEdit = (_id, options) => {
    return getRequest(`${apiURL}/papers/edit/${_id}`, options);
};

const postPaper = (_id, data, options) => {
    return postRequest(`${apiURL}/papers/${_id}`, data, options);
};

const putPaper = (_id, data, options) => {
    return putRequest(`${apiURL}/papers/${_id}`, data, options);
};

const patchPaper = (_id, data, options) => {
    return patchRequest(`${apiURL}/papers/${_id}`, data, options);
};

const deletePaper = (_id, options) => {
    return deleteRequest(`${apiURL}/papers/${_id}`, options);
};

const useGetPapers = (requestOptions, mutateOptions) => {
    return useMutationWithTranslations(
        params =>
            getPapers({
                ...requestOptions,
                ...params,
            }),
        {
            mutationKey: 'papers.getPapers',
            ...mutateOptions,
        }
    );
};

const useGetPaper = (requestOptions, queryOptions) => {
    return useQueryWithTranslations({
        queryKey: 'papers.getPaper',
        ...queryOptions,
        queryFn: _id => getPaper(_id, requestOptions),
    });
};

const useGetEdit = (requestOptions, queryOptions) => {
    return useQueryWithTranslations({
        queryKey: 'papers.getEdit',
        ...queryOptions,
        queryFn: _id => getPaper(_id, requestOptions),
    });
};

const usePostPaper = (requestOptions, mutateOptions) => {
    return useMutationWithTranslations((_id, data) => postPaper(_id, data, requestOptions), {
        mutationKey: 'papers.postPaper',
        ...mutateOptions,
    });
};

const usePutPaper = (requestOptions, mutateOptions) => {
    return useMutationWithTranslations((_id, data) => putPaper(_id, data, requestOptions), {
        mutationKey: 'papers.putPaper',
        ...mutateOptions,
    });
};

const usePatchPaper = (requestOptions, mutateOptions) => {
    return useMutationWithTranslations((_id, data) => patchPaper(_id, data, requestOptions), {
        mutationKey: 'papers.patchPaper',
        ...mutateOptions,
    });
};

const useDeletePaper = (requestOptions, queryOptions) => {
    return useQueryWithTranslations({
        queryKey: 'papers.deletePaper',
        ...queryOptions,
        queryFn: _id => deletePaper(_id, requestOptions),
    });
};

export default {
    getPapers,
    getPaper,
    getEdit,
    postPaper,
    putPaper,
    patchPaper,
    deletePaper,
    useGetPapers,
    useGetPaper,
    useGetEdit,
    usePostPaper,
    usePutPaper,
    usePatchPaper,
    useDeletePaper,
};
