import { apiUrlV1 } from '../../configs/url.config';
import { getRequest, postRequest, putRequest, useMutationWithTranslations, useQueryWithTranslations } from '../../utils/requests';

const getCourse = (_id, options) => {
    return getRequest(`${apiUrlV1}/course/${_id}`, options);
};

const getEdit = (_id, options) => {
    return getRequest(`${apiUrlV1}/course/edit/${_id}`, options);
};

const postCourse = (data, options) => {
    return postRequest(`${apiUrlV1}/course`, data, options);
};

const putCourse = (_id, data, options) => {
    return putRequest(`${apiUrlV1}/course/${_id}`, data, options);
};

const useGetCourse = (requestOptions, queryOptions) => {
    return useQueryWithTranslations({
        queryKey: 'course.getCourse',
        ...queryOptions,
        queryFn: _id => getCourse(_id, requestOptions),
    });
};

const useGetEdit = (requestOptions, queryOptions) => {
    return useQueryWithTranslations({
        queryKey: 'course.getEdit',
        ...queryOptions,
        queryFn: _id => getEdit(_id, requestOptions),
    });
};

const usePostCourse = (requestOptions, mutateOptions) => {
    return useMutationWithTranslations(data => postCourse(data, requestOptions), {
        mutationKey: 'course.postCourse',
        ...mutateOptions,
    });
};

const usePutCourse = (requestOptions, mutateOptions) => {
    return useMutationWithTranslations((_id, data) => putCourse(_id, data, requestOptions), {
        mutationKey: 'course.putCourse',
        ...mutateOptions,
    });
};

export { getCourse, getEdit, postCourse, putCourse, useGetCourse, useGetEdit, usePostCourse, usePutCourse };
