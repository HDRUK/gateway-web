import { apiV2URL } from '../../configs/url.config';
import { patchRequest, useMutationWithTranslations } from '../../utils/requests';

const patchPublisherDetails = (_id, data, options) => {
    return patchRequest(`${apiV2URL}/publishers/${_id}/details`, data, options);
};

const usePatchPublisherDetails = (requestOptions, mutateOptions) => {
    return useMutationWithTranslations(
        data => {
            const { _id, ...outerProps } = data;

            return patchPublisherDetails(_id, outerProps, requestOptions);
        },
        {
            mutationKey: 'publishers.patchPublisherDetails',
            ...mutateOptions,
        }
    );
};

export default {
    patchPublisherDetails,
    usePatchPublisherDetails,
};
