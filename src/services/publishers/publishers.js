import { apiURL } from '../../configs/url.config';
import { patchRequest, useMutationWithTranslations } from '../../utils/requests';

const patchPublisherDataUseWidget = (_id, data, options) => {
    console.log(`${apiURL}/publishers/${_id}/dataUseWidget`);
    return patchRequest(`${apiURL}/publishers/${_id}/dataUseWidget`, data, options);
};

const usePatchPublisherDataUseWidget = (requestOptions, mutateOptions) => {
    return useMutationWithTranslations(
        data => {
            const { _id, ...outerProps } = data;

            console.log('DATA', `${apiURL}/publishers/${_id}/dataUseWidget`);

            return patchPublisherDataUseWidget(_id, outerProps.data, requestOptions);
        },
        {
            mutationKey: 'publishers.patchPublisherDataUseWidget',
            ...mutateOptions,
        }
    );
};

export default {
    patchPublisherDataUseWidget,
    usePatchPublisherDataUseWidget,
};
