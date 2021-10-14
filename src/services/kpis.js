import { useQuery } from 'react-query';
import { apiURL } from '../configs/url.config';
import { getRequest } from '../utils/requests';

const getKpis = options => {
	return getRequest(`${apiURL}/kpis`, options);
};

const useGetKpis = (requestOptions, queryOptions = { queryKey: 'getKpis' }) => {
	return useQuery({
		...queryOptions,
		queryFn: () => getKpis(requestOptions),
	});
};

export default {
	getKpis,
	useGetKpis,
};
