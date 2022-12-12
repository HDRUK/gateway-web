import { apiURL } from '../../configs/url.config';
import { getRequest, useQueryWithTranslations } from '../../utils/requests';

const getTotalUsers = options => {
    return getRequest(`${apiURL}/analyticsdashboard/totalusers`, options);
};

const getUsersPerMonth = options => {
    return getRequest(`${apiURL}/analyticsdashboard/userspermonth`, options);
};

const useGetTotalUsers = (requestOptions, queryOptions) => {
    return useQueryWithTranslations({
        queryKey: 'analyticsdashboard.getTotalUsers',
        ...queryOptions,
        queryFn: () => getTotalUsers(requestOptions),
    });
};

const useGetUsersPerMonth = (requestOptions, queryOptions) => {
    return useQueryWithTranslations({
        queryKey: 'analyticsdashboard.getUsersPerMonth',
        ...queryOptions,
        queryFn: () => getUsersPerMonth(requestOptions),
    });
};

export default {
    getTotalUsers,
    getUsersPerMonth,
    useGetTotalUsers,
    useGetUsersPerMonth,
};
