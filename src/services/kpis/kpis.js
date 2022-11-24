import { apiUrlV1 } from '../../configs/url.config';
import { getRequest, useQueryWithTranslations } from '../../utils/requests';

const getKpis = options => {
    return getRequest(`${apiUrlV1}/kpis`, options);
};

const useGetKpis = (requestOptions, queryOptions) => {
    return useQueryWithTranslations({
        queryKey: 'kpis.getKpis',
        ...queryOptions,
        queryFn: () => getKpis(requestOptions),
    });
};

export default {
    getKpis,
    useGetKpis,
};
