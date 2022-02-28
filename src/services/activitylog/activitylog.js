import { apiV2URL } from '../../configs/url.config';
import { postRequest, useMutationWithTranslations } from '../../utils/requests';

const postActivityLog = (data, options) => {
    return postRequest(`${apiV2URL}/activitylog`, data, options);
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
