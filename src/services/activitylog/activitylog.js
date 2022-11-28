import { apiUrlV2 } from '../../configs/url.config';
import { postRequest, useMutationWithTranslations } from '../../utils/requests';

const postActivityLog = (data, options) => {
    return postRequest(`${apiUrlV2}/activitylog`, data, options);
};

const usePostActivityLog = (requestOptions, mutateOptions) => {
    return useMutationWithTranslations(data => postActivityLog(data, requestOptions), {
        mutationKey: 'activitylog.postActivityLog',
        ...mutateOptions,
    });
};

export default {
    postActivityLog,
    usePostActivityLog,
};
