import { apiUrlV1 } from '../../configs/url.config';
import { getRequest, useQueryWithTranslations } from '../../utils/requests';

const getContributorsInfo = (applicationId, options) =>
    getRequest(`${apiUrlV1}/data-access-request/prepopulate-contributors/${applicationId}`, options);

const useGetContributorsInfo = (requestOptions, queryOptions) =>
    useQueryWithTranslations({
        queryKey: 'contributors.getContributorsInfo',
        ...queryOptions,
        queryFn: () => getContributorsInfo(requestOptions),
    });

export default {
    getContributorsInfo,
    useGetContributorsInfo,
};
