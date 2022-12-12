import { apiURL, apiV2URL } from '../../configs/url.config';
import { getRequest, useMutationWithTranslations } from '../../utils/requests';

const getDatasets = options => {
    return getRequest(`${apiV2URL}/datasets`, options);
};

const getDataset = (_id, options) => {
    return getRequest(`${apiURL}/datasets/${_id}`, options);
};

const useGetDatasets = (requestOptions, mutateOptions) => {
    return useMutationWithTranslations(
        params =>
            getDatasets({
                ...requestOptions,
                ...params,
            }),
        {
            mutationKey: 'datasets.getDatasets',
            ...mutateOptions,
        }
    );
};

const useGetDataset = (requestOptions, mutateOptions) => {
    return useMutationWithTranslations(_id => getDataset(_id, requestOptions), {
        mutationKey: 'datasets.getDataset',
        ...mutateOptions,
    });
};

export default {
    getDatasets,
    getDataset,
    useGetDatasets,
    useGetDataset,
};
