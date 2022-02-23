import { useMutation } from 'react-query';
import { apiURL } from '../../configs/url.config';
import { getRequest } from '../../utils/requests';

const getRelatedObject = (_id, type, options) => {
	return getRequest(`${apiURL}/relatedobject/${type}/${_id}`, options);
};

const getRelatedObjectForCourse = (_id, options) => {
	return getRequest(`${apiURL}/relatedobject/course/${_id}`, options);
};

const getLinkedDatasets = (relation, options) => {
	return getRequest(`${apiURL}/relatedobject/linkeddatasets/${relation}`, options);
};

const useGetRelatedObjectRequest = (requestOptions, mutateOptions) => {
	return useMutation((_id, type) => getRelatedObject(_id, requestOptions), {
		mutationKey: 'getRelatedObject',
		...mutateOptions,
	});
};

const useGetRelatedObjectForCourse = (requestOptions, mutateOptions) => {
	return useMutation(_id => getRelatedObjectForCourse(_id, requestOptions), {
		mutationKey: 'getRelatedObjectForCourse',
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
	getRelatedObject,
	getRelatedObjectForCourse,
	getLinkedDatasets,
	useGetRelatedObjectRequest,
	useGetRelatedObjectForCourse,
	useGetLinkedDatasets,
};
