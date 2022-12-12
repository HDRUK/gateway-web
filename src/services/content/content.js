import { getRequest, useQueryWithTranslations } from '../../utils/requests';
import { UATCMSURL } from './content.constants';

const baseURL = require('../../pages/commonComponents/BaseURL');

const cmsURL = baseURL.getCMSURL();
const env = baseURL.getURLEnv();
const local = 'local';

const getNon5SafesModalContentRequest = options => {
    const url = env === local ? UATCMSURL : cmsURL;
    return getRequest(`${url}/Non5SafesModalContent`, options);
};

const useGetNon5SafesModalContentRequest = (requestOptions, queryOptions) => {
    return useQueryWithTranslations({
        queryKey: 'content.getNon5SafesModalContentRequest',
        ...queryOptions,
        queryFn: () => getNon5SafesModalContentRequest(requestOptions),
    });
};

export default {
    getNon5SafesModalContentRequest,
    useGetNon5SafesModalContentRequest,
};
