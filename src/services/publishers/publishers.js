import { apiUrlV1 } from '../../configs/url.config';

import { getRequest, patchRequest, useMutationWithTranslations } from '../../utils/requests';

const getPublisher = (_id, options) => {
    return getRequest(`${apiUrlV1}/publishers/${_id}`, options);
};

const patchModalContent = (_id, data, options) => {
    return patchRequest(`${apiUrlV1}/publishers/dataRequestModalContent/${_id}`, data, options);
};

const patchQuestionBank = (_id, data, options) => {
    return patchRequest(`${apiUrlV1}/publishers/${_id}/questionbank`, data, options);
};

const useGetPublisher = (requestOptions, mutateOptions) => {
    return useMutationWithTranslations(
        _id => {
            return getPublisher(_id, requestOptions);
        },
        {
            mutationKey: 'publishers.getPublisher',
            ...mutateOptions,
        }
    );
};

const usePatchModalContent = (requestOptions, mutateOptions) => {
    return useMutationWithTranslations(
        data => {
            const { _id, ...outerProps } = data;

            return patchModalContent(_id, outerProps, requestOptions);
        },
        {
            mutationKey: 'publishers.patchModalContent',
            ...mutateOptions,
        }
    );
};

const usePatchQuestionBank = (requestOptions, mutateOptions) => {
    return useMutationWithTranslations(
        data => {
            const { _id, ...outerProps } = data;

            return patchQuestionBank(_id, outerProps, requestOptions);
        },
        {
            mutationKey: 'publishers.patchQuestionBank',
            ...mutateOptions,
        }
    );
};

const patchPublisherDataUseWidget = (_id, data, options) => {
    return patchRequest(`${apiUrlV1}/publishers/${_id}/dataUseWidget`, data, options);
};

const usePatchPublisherDataUseWidget = (requestOptions, mutateOptions) => {
    return useMutationWithTranslations(
        data => {
            const { _id, ...outerProps } = data;

            return patchPublisherDataUseWidget(_id, outerProps.data, requestOptions);
        },
        {
            mutationKey: 'publishers.patchPublisherDataUseWidget',

            ...mutateOptions,
        }
    );
};

export {
    getPublisher,
    patchModalContent,
    useGetPublisher,
    usePatchModalContent,
    usePatchQuestionBank,
    patchPublisherDataUseWidget,
    usePatchPublisherDataUseWidget,
};
