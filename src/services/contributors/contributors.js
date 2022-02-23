import { useQuery } from 'react-query';
import { apiURL } from '../../configs/url.config';
import { getRequest } from '../../utils/requests';

const getContributorsInfo = (applicationId, options) => {
	return getRequest(`${apiURL}/data-access-request/prepopulate-contributors/${applicationId}`, options);
};

const useGetContributorsInfo = (requestOptions, queryOptions) => {
	return useQuery({
		queryKey: 'getContributorsInfo',
		...queryOptions,
		queryFn: () => getContributorsInfo(requestOptions),
	});
};

export default {
	getContributorsInfo,
	useGetContributorsInfo,
};
