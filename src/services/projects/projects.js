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

const getProjects = options => {
    return getRequest(`${apiURL}/projects/getList`, options);
};

const getProject = (_id, options) => {
    return getRequest(`${apiURL}/projects/${_id}`, options);
};

const postProject = (_id, data, options) => {
    return postRequest(`${apiURL}/projects/${_id}`, data, options);
};

const putProject = (_id, data, options) => {
    return putRequest(`${apiURL}/projects/${_id}`, data, options);
};

const patchProject = (_id, data, options) => {
    return patchRequest(`${apiURL}/projects/${_id}`, data, options);
};

const deleteProject = (_id, options) => {
    return deleteRequest(`${apiURL}/projects/${_id}`, options);
};

const useGetProjects = (requestOptions, queryOptions) => {
    return useQueryWithTranslations({
        queryKey: 'projects.getProjects',
        ...queryOptions,
        queryFn: () => getProjects(requestOptions),
    });
};

const useGetProject = (requestOptions, queryOptions) => {
    return useQueryWithTranslations({
        queryKey: 'projects.getProject',
        ...queryOptions,
        queryFn: _id => getProject(_id, requestOptions),
    });
};

const usePostProject = (requestOptions, mutateOptions) => {
    return useMutationWithTranslations((_id, data) => postProject(_id, data, requestOptions), {
        mutationKey: 'projects.postProject',
        ...mutateOptions,
    });
};

const usePutProject = (requestOptions, mutateOptions) => {
    return useMutationWithTranslations((_id, data) => putProject(_id, data, requestOptions), {
        mutationKey: 'projects.putProject',
        ...mutateOptions,
    });
};

const usePatchProject = (requestOptions, mutateOptions) => {
    return useMutationWithTranslations((_id, data) => patchProject(_id, data, requestOptions), {
        mutationKey: 'projects.patchProject',
        ...mutateOptions,
    });
};

const useDeleteProject = (requestOptions, queryOptions) => {
    return useQueryWithTranslations({
        queryKey: 'projects.deleteProject',
        ...queryOptions,
        queryFn: _id => deleteProject(_id, requestOptions),
    });
};

export default {
    getProjects,
    getProject,
    postProject,
    putProject,
    patchProject,
    deleteProject,
    useGetProjects,
    useGetProject,
    usePostProject,
    usePutProject,
    usePatchProject,
    useDeleteProject,
};
