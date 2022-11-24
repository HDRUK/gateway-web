import { apiUrlV1 } from '../../configs/url.config';
import { getRequest, patchRequest, useMutationWithTranslations, useQueryWithTranslations } from '../../utils/requests';

const getUsers = options => {
    return getRequest(`${apiUrlV1}/users`, options);
};

const getUserById = (id, options) => {
    return getRequest(`${apiUrlV1}/person/${id}`, options);
};

const searchUsers = (term, options) => {
    return getRequest(`${apiUrlV1}/users/search/${term}`, options);
};

const patchRoles = (_id, data, options) => {
    return patchRequest(`${apiUrlV1}/users/advancedsearch/roles/${_id}`, data, options);
};

const patchTerms = (_id, data, options) => {
    return patchRequest(`${apiUrlV1}/users/advancedsearch/terms/${_id}`, data, options);
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
    return useMutationWithTranslations(
        data => {
            const { _id, ...outerProps } = data;

            return patchRoles(_id, outerProps, requestOptions);
        },
        {
            mutationKey: 'users.patchRoles',
            ...mutateOptions,
        }
    );
};

const usePatchTerms = (requestOptions, mutateOptions) => {
    return useMutationWithTranslations(
        data => {
            const { _id, ...outerProps } = data;

            return patchTerms(_id, outerProps, requestOptions);
        },
        {
            mutationKey: 'users.patchTerms',
            ...mutateOptions,
        }
    );
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
