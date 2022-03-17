import { apiV2URL } from '../../configs/url.config';
import { getRequest, patchRequest, postRequest, useMutationWithTranslations } from '../../utils/requests';

const getDataUseRegisters = options => {
    return getRequest(`${apiV2URL}/data-use-registers`, options);
};

const getDataUseRegistersByTeam = (team, options) => {
    return getRequest(`${apiV2URL}/data-use-registers?team=${team}`, options);
};

const getDataUseRegister = (_id, options) => {
    return getRequest(`${apiV2URL}/data-use-registers/${_id}?isEdit=true`, options);
};

const patchDataUseRegister = (_id, data, options) => {
    return patchRequest(`${apiV2URL}/data-use-registers/${_id}`, data, options);
};

const patchDataUseRegisterCounter = (data, options) => {
    return patchRequest(`${apiV2URL}/data-use-registers/counter`, data, options);
};

const postDataUseRegisterCheck = (data, options) => {
    return postRequest(`${apiV2URL}/data-use-regiasdasdsters/check`, data, options);
};

const postDataUseRegisterUpload = (data, options) => {
    return postRequest(`${apiV2URL}/data-use-registers/upload`, data, options);
};

const useGetDataUseRegisters = (requestOptions, mutateOptions) => {
    return useMutationWithTranslations(
        params =>
            getDataUseRegisters({
                ...requestOptions,
                ...params,
            }),
        {
            mutationKey: 'dur.getDataUseRegisters',
            ...mutateOptions,
        }
    );
};

const useGetDataUseRegistersByTeam = (requestOptions, mutateOptions) => {
    return useMutationWithTranslations(team => getDataUseRegistersByTeam(team, requestOptions), {
        mutationKey: 'dur.getDataUseRegistersByTeam',
        ...mutateOptions,
    });
};

const useGetDataUseRegister = (requestOptions, mutateOptions) => {
    return useMutationWithTranslations(_id => getDataUseRegister(_id, requestOptions), {
        mutationKey: 'dur.getDataUseRegister',
        ...mutateOptions,
    });
};

const usePatchDataUseRegister = (requestOptions, mutateOptions) => {
    return useMutationWithTranslations(
        data => {
            const { _id, ...outerProps } = data;

            return patchDataUseRegister(_id, outerProps, requestOptions);
        },
        {
            mutationKey: 'dur.patchDataUseRegister',
            ...mutateOptions,
        }
    );
};

const usePatchDataUseRegisterCounter = (requestOptions, mutateOptions) => {
    return useMutationWithTranslations(data => patchDataUseRegisterCounter(data, requestOptions), {
        mutationKey: 'dur.patchDataUseRegisterCounter',
        ...mutateOptions,
    });
};

const usePostDataUseRegisterCheck = (requestOptions, mutateOptions) => {
    return useMutationWithTranslations(data => postDataUseRegisterCheck(data, requestOptions), {
        mutationKey: 'dur.postDataUseRegisterCheck',
        ...mutateOptions,
    });
};

const usePostDataUseRegisterUpload = (requestOptions, mutateOptions) => {
    return useMutationWithTranslations(data => postDataUseRegisterUpload(data, requestOptions), {
        mutationKey: 'dur.postDataUseRegisterUpload',
        ...mutateOptions,
    });
};

export default {
    getDataUseRegisters,
    getDataUseRegistersByTeam,
    getDataUseRegister,
    patchDataUseRegister,
    patchDataUseRegisterCounter,
    postDataUseRegisterCheck,
    postDataUseRegisterUpload,
    useGetDataUseRegisters,
    useGetDataUseRegistersByTeam,
    useGetDataUseRegister,
    usePatchDataUseRegister,
    usePatchDataUseRegisterCounter,
    usePostDataUseRegisterCheck,
    usePostDataUseRegisterUpload,
};
