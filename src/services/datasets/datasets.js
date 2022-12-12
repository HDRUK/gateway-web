import { apiUrlV1, apiUrlV2 } from '../../configs/url.config';
import { getRequest, useMutationWithTranslations } from '../../utils/requests';

const getDatasets = options => {
    return getRequest(`${apiUrlV2}/datasets`, options);
};

const getDataset = (_id, options) => {
    return getRequest(`${apiUrlV1}/datasets/${_id}`, options);
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

export { getDatasets, getDataset, useGetDatasets, useGetDataset };
