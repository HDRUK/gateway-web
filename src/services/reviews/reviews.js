import { apiUrlV1 } from '../../configs/url.config';
import { getRequest, useQueryWithTranslations } from '../../utils/requests';

const getReviews = options => {
    return getRequest(`${apiUrlV1}/reviews`, options);
};

const getPending = options => {
    return getRequest(`${apiUrlV1}/reviews/pending`, options);
};

const getAdminPending = options => {
    return getRequest(`${apiUrlV1}/reviews/admin/pending`, options);
};

const useGetReviews = (requestOptions, queryOptions) => {
    return useQueryWithTranslations({
        queryKey: 'reviews.getReviews',
        ...queryOptions,
        queryFn: () => getReviews(requestOptions),
    });
};

const useGetPending = (requestOptions, queryOptions) => {
    return useQueryWithTranslations({
        queryKey: 'reviews.getPending',
        ...queryOptions,
        queryFn: () => getPending(requestOptions),
    });
};

const useGetAdminPending = (requestOptions, queryOptions) => {
    return useQueryWithTranslations({
        queryKey: 'reviews.getAdminPending',
        ...queryOptions,
        queryFn: () => getAdminPending(requestOptions),
    });
};

export { getReviews, getAdminPending, getPending, useGetReviews, useGetPending, useGetAdminPending };
