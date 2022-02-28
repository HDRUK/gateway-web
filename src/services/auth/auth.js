import { apiURL } from '../../configs/url.config';
import { getRequest, postRequest, useMutationWithTranslations, useQueryWithTranslations } from '../../utils/requests';

const getStatus = options => {
    return getRequest(`${apiURL}/auth/status`, options);
};

const getLogout = options => {
    return getRequest(`${apiURL}/auth/logout`, options);
};

const postRegister = (data, options) => {
    return postRequest(`${apiURL}/auth/register`, data, options);
};

const useGetStatus = (requestOptions, queryOptions) => {
    return useQueryWithTranslations({
        queryKey: 'auth.getStatus',
        ...queryOptions,
        queryFn: () => getStatus(requestOptions),
    });
};

const useGetLogout = (requestOptions, queryOptions) => {
    return useQueryWithTranslations({
        queryKey: 'auth.getLogout',
        ...queryOptions,
        queryFn: () => getLogout(requestOptions),
    });
};

const usePostRegister = (requestOptions, mutateOptions) => {
    return useMutationWithTranslations(data => postRegister(data, requestOptions), {
        mutationKey: 'auth.postRegister',
        ...mutateOptions,
    });
};

export default {
    getStatus,
    getLogout,
    postRegister,
    useGetStatus,
    useGetLogout,
    usePostRegister,
};
