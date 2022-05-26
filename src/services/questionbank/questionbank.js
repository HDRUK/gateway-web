import { apiV2URL } from '../../configs/url.config';
import { getRequest, patchRequest, postRequest, useMutationWithTranslations } from '../../utils/requests';

const getQuestionbankItem = (_id, options) => {
    return getRequest(`${apiV2URL}/questionbank/${_id}`, options);
};

const postQuestionbankItem = (_id, data, options) => {
    return postRequest(`${apiV2URL}/questionbank/${_id}`, data, options);
};

const patchClearAll = (_id, options) => {
    return patchRequest(`${apiV2URL}/questionbank/${_id}`, options);
};

const patchClearSection = (_id, questionSetId, options) => {
    return patchRequest(`${apiV2URL}/questionbank/${_id}?questionSet=${questionSetId}`, options);
};

const useGetQuestionbankItem = (requestOptions, mutateOptions) => {
    return useMutationWithTranslations(id => getQuestionbankItem(id, requestOptions), {
        mutationKey: 'questionbank.getQuestionbankItem',
        ...mutateOptions,
    });
};

const usePostQuestionbankItem = (requestOptions, mutateOptions) => {
    return useMutationWithTranslations(({ id, ...outerProps }) => postQuestionbankItem(id, outerProps, requestOptions), {
        mutationKey: 'questionbank.postQuestionbankItem',
        ...mutateOptions,
    });
};

const usePatchClearAll = (requestOptions, mutateOptions) => {
    return useMutationWithTranslations(id => patchClearAll(id, requestOptions), {
        mutationKey: 'questionbank.patchClearAll',
        ...mutateOptions,
    });
};

const usePatchClearSection = (requestOptions, mutateOptions) => {
    return useMutationWithTranslations(({ id, questionSetId }) => patchClearSection(id, questionSetId, requestOptions), {
        mutationKey: 'questionbank.patchClearSection',
        ...mutateOptions,
    });
};

export default {
    getQuestionbankItem,
    postQuestionbankItem,
    patchClearAll,
    patchClearSection,
    useGetQuestionbankItem,
    usePostQuestionbankItem,
    usePatchClearAll,
    usePatchClearSection,
};
