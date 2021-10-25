import { useQuery } from 'react-query';
import { getRequest } from '../utils/requests';
import { UATCMSURL } from './content.constants';

const baseURL = require('../pages/commonComponents/BaseURL');
const cmsURL = baseURL.getCMSURL();
const env = baseURL.getURLEnv();
const local = 'local';

export const getNon5SafesModalContentRequest = (options) => {
    const url = env === local ? UATCMSURL : cmsURL;
	return getRequest(`${url}/Non5SafesModalContent`, options);
};

const useGetNon5SafesModalContentRequest = (requestOptions, queryOptions = { queryKey: 'getNon5SafesModalContentRequest' }) => {
	return useQuery({
		...queryOptions,
		queryFn: () => getNon5SafesModalContentRequest(requestOptions),
	});
};

export default {
    useGetNon5SafesModalContentRequest
}
