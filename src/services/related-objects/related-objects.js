import { useMutation } from 'react-query';
import { apiURL } from '../../configs/url.config';
import { getRequest } from '../../utils/requests';

const getRelatedObjectRequest = (_id, type, options) => {
	return getRequest(`${apiURL}/relatedobject/${type}/${_id}`, options);
};

const getRelatedObjectForCourseRequest = (_id, options) => {
	return getRequest(`${apiURL}/relatedobject/course/${_id}`, options);
};

const getLinkedDatasets = (relation, options) => {
	return getRequest(`${apiURL}/relatedobject/linkeddatasets/${relation}`, options);
};

const useGetRelatedObjectRequest = (requestOptions, mutateOptions) => {
	return useMutation(_id => getRelatedObjectForCourseRequest(_id, requestOptions), {
		mutationKey: 'getRelatedObjectRequest',
		...mutateOptions,
	});
};

const useGetRelatedObjectForCourseRequest = (requestOptions, mutateOptions) => {
	return useMutation(_id => getRelatedObjectForCourseRequest(_id, requestOptions), {
		mutationKey: 'getRelatedObjectForCourseRequest',
		...mutateOptions,
	});
};

const useGetLinkedDatasets = (requestOptions, mutateOptions) => {
	return useMutation(relation => getLinkedDatasets(relation, requestOptions), {
		mutationKey: 'getLinkedDatasets',
		...mutateOptions,
	});
};

export default {
	getRelatedObjectRequest,
	getRelatedObjectForCourseRequest,
	getLinkedDatasets,
	useGetRelatedObjectRequest,
	useGetRelatedObjectForCourseRequest,
	useGetLinkedDatasets,
};
