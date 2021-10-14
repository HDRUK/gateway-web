import { useQuery } from 'react-query';
import { apiURL } from '../configs/url.config';
import { getRequest } from '../utils/requests';

const getRelatedObject = (_id, options) => {
	return getRequest(`${apiURL}/relatedobject/${_id}`, options);
};

const getCourse = (_id, options) => {
	return getRequest(`${apiURL}/relatedobject/course/${_id}`, options);
};

const getLinkedDatasets = (relation, options) => {
	return getRequest(`${apiURL}/relatedobject/linkeddatasets/${relation}`, options);
};

const useGetRelatedObject = (requestOptions, queryOptions = { queryKey: 'getRelatedObject' }) => {
	return useQuery({
		...queryOptions,
		queryFn: _id => getRelatedObject(_id, requestOptions),
	});
};

const useGetCourse = (requestOptions, queryOptions = { queryKey: 'getCourse' }) => {
	return useQuery({
		...queryOptions,
		queryFn: _id => getCourse(_id, requestOptions),
	});
};

const useGetLinkedDatasets = (requestOptions, queryOptions = { queryKey: 'getLinkedDatasets' }) => {
	return useQuery({
		...queryOptions,
		queryFn: relation => getLinkedDatasets(relation, requestOptions),
	});
};

export default {
	getRelatedObject,
	getCourse,
	getLinkedDatasets,
	useGetRelatedObject,
	useGetCourse,
	useGetLinkedDatasets,
};
