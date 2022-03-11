import { apiURL } from '../../configs/url.config';
import { getRequest, patchRequest, useMutationWithTranslations, useQueryWithTranslations } from '../../utils/requests';

const getUsers = options => {
    return getRequest(`${apiURL}/users`, options);
};

const getUserById = (id, options) => {
    return getRequest(`${apiURL}/person/${id}`, options);
};

const searchUsers = (term, options) => {
    return getRequest(`${apiURL}/users/search/${term}`, options);
};

const patchRoles = (_id, data, options) => {
    return patchRequest(`${apiURL}/users/advancedsearch/roles/${_id}`, data, options);
};

const patchTerms = (_id, data, options) => {
    return patchRequest(`${apiURL}/users/advancedsearch/terms/${_id}`, data, options);
};

const useGetUsers = (requestOptions, queryOptions) => {
    return useQueryWithTranslations({
        queryKey: 'users.getUsers',
        ...queryOptions,
        queryFn: () => getUsers(requestOptions),
    });
};

const useGetUserById = (requestOptions, mutateOptions) => {
    return useMutationWithTranslations(id => getUserById(id, requestOptions), {
        mutationKey: 'users.getUserById',
        ...mutateOptions,
    });
};

const useSearchUsers = (requestOptions, mutateOptions) => {
    return useMutationWithTranslations(term => searchUsers(term, requestOptions), {
        mutationKey: 'users.searchUsers',
        ...mutateOptions,
    });
};

const usePatchRoles = (requestOptions, mutateOptions) => {
    return useMutationWithTranslations((_id, data) => patchRoles(_id, data, requestOptions), {
        mutationKey: 'users.patchRoles',
        ...mutateOptions,
    });
};

const usePatchTerms = (requestOptions, mutateOptions) => {
    return useMutationWithTranslations((_id, data) => patchTerms(_id, data, requestOptions), {
        mutationKey: 'users.patchTerms',
        ...mutateOptions,
    });
};

export default {
    getUsers,
    getUserById,
    searchUsers,
    patchRoles,
    patchTerms,
    useGetUsers,
    useGetUserById,
    useSearchUsers,
    usePatchRoles,
    usePatchTerms,
};
