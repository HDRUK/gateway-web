import { useQuery } from 'react-query';
import { apiURL } from '../configs/url.config';
import { getRequest } from '../utils/requests';

const getRelatedObjectRequest = (_id, options) => {
	return getRequest(`${apiURL}/relatedobject/${_id}`, options);
};

const getRelatedObjectForCourseRequest = (_id, options) => {
	return getRequest(`${apiURL}/relatedobject/course/${_id}`, options);
};

const useGetRelatedObjectRequest = (requestOptions, queryOptions = { queryKey: 'getRelatedObjectRequest' }) => {
	return useQuery({
		...queryOptions,
		queryFn: _id => getRelatedObjectRequest(_id, requestOptions),
	});
};

const useGetRelatedObjectForCourseRequest = (requestOptions, queryOptions = { queryKey: 'getRelatedObjectForCourseRequest' }) => {
	return useQuery({
		...queryOptions,
		queryFn: _id => getRelatedObjectForCourseRequest(_id, requestOptions),
	});
};

export default {
    getRelatedObjectRequest,
    getRelatedObjectForCourseRequest,
    useGetRelatedObjectRequest,
    useGetRelatedObjectForCourseRequest
}
