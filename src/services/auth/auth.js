import { addCmsGatewayApiHostname, apiPathV1, apiUrlV1 } from '../../configs/url.config';
import { getRequest, postRequest, useMutationWithTranslations, useQueryWithTranslations } from '../../utils/requests';

const getStatus = options => {
    return getRequest(addCmsGatewayApiHostname(`${apiPathV1}/auth/status`), options);
};

const getLogout = options => {
    return getRequest(`${apiUrlV1}/auth/logout`, options);
};

const postRegister = (data, options) => {
    return postRequest(`${apiUrlV1}/auth/register`, data, options);
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
