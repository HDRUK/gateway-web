import { useMutation, useQuery } from 'react-query';
import { apiURL } from '../configs/url.config';
import { getRequest, postRequest, putRequest } from '../utils/requests';

const getCourse = (_id, options) => {
	return getRequest(`${apiURL}/course/${_id}`, options);
};

const getEdit = (_id, options) => {
	return getRequest(`${apiURL}/course/edit/${_id}`, options);
};

const postCourse = (data, options) => {
	return postRequest(`${apiURL}/course`, data, options);
};

const putCourse = (_id, data, options) => {
	return putRequest(`${apiURL}/course/${_id}`, data, options);
};

const useGetCourse = (requestOptions, queryOptions = { queryKey: 'getCourse' }) => {
	return useQuery({
		...queryOptions,
		queryFn: _id => getCourse(_id, requestOptions),
	});
};

const useGetEdit = (requestOptions, queryOptions = { queryKey: 'getEdit' }) => {
	return useQuery({
		...queryOptions,
		queryFn: _id => getEdit(_id, requestOptions),
	});
};

const usePostCourse = (requestOptions, mutateOptions = { queryKey: 'postCourse' }) => {
	return useMutation(data => postCourse(data, requestOptions), {
		mutateOptions,
	});
};

const usePutCourse = (requestOptions, mutateOptions = { queryKey: 'putCourse' }) => {
	return useMutation((_id, data) => putCourse(_id, data, requestOptions), {
		mutateOptions,
	});
};

export default {
	getCourse,
	getEdit,
	postCourse,
	putCourse,
	useGetCourse,
	useGetEdit,
	usePostCourse,
	usePutCourse,
};
