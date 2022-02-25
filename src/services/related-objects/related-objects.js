import { apiURL } from '../../configs/url.config';
import { getRequest, useMutationWithTranslations } from '../../utils/requests';

const getRelatedObject = (_id, options) => {
	return getRequest(`${apiURL}/relatedobject/${_id}`, options);
};

const getRelatedObjectByType = (_id, type, options) => {
	return getRequest(`${apiURL}/relatedobject/${type}/${_id}`, options);
};

const getRelatedObjectForCourse = (_id, options) => {
	return getRequest(`${apiURL}/relatedobject/course/${_id}`, options);
};

const getLinkedDatasets = (relation, options) => {
	return getRequest(`${apiURL}/relatedobject/linkeddatasets/${relation}`, options);
};

const useGetRelatedObject = (requestOptions, mutateOptions) => {
	return useMutationWithTranslations(_id => getRelatedObject(_id, requestOptions), {
		mutationKey: 'getRelatedObject',
		...mutateOptions,
	});
};

const useGetRelatedObjectByType = (requestOptions, mutateOptions) => {
	return useMutationWithTranslations((_id, type) => getRelatedObjectByType(_id, type, requestOptions), {
		mutationKey: 'getRelatedObjectByType',
		...mutateOptions,
	});
};

const useGetRelatedObjectForCourse = (requestOptions, mutateOptions) => {
	return useMutationWithTranslations(_id => getRelatedObjectForCourse(_id, requestOptions), {
		mutationKey: 'getRelatedObjectForCourse',
		...mutateOptions,
	});
};

const useGetLinkedDatasets = (requestOptions, mutateOptions) => {
	return useMutationWithTranslations(relation => getLinkedDatasets(relation, requestOptions), {
		mutationKey: 'getLinkedDatasets',
		...mutateOptions,
	});
};

export default {
	getRelatedObject,
	getRelatedObjectByType,
	getRelatedObjectForCourse,
	getLinkedDatasets,
	useGetRelatedObject,
	useGetRelatedObjectByType,
	useGetRelatedObjectForCourse,
	useGetLinkedDatasets,
};
