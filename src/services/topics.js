import { useMutation, useQuery } from 'react-query';
import { apiURL } from '../configs/url.config';
import { deleteRequest, getRequest, patchRequest, postRequest, putRequest } from '../utils/requests';

const getTopics = options => {
	return getRequest(`${apiURL}/topics`, options);
};

const getTopic = (_id, options) => {
	return getRequest(`${apiURL}/topics/${_id}`, options);
};

const postTopic = (_id, data, options) => {
	return postRequest(`${apiURL}/topics/${_id}`, data, options);
};

const putTopic = (_id, data, options) => {
	return putRequest(`${apiURL}/topics/${_id}`, data, options);
};

const patchTopic = (_id, data, options) => {
	return patchRequest(`${apiURL}/topics/${_id}`, data, options);
};

const deleteTopic = (_id, options) => {
	return deleteRequest(`${apiURL}/topics/${_id}`, options);
};

const useGetTopics = (requestOptions, queryOptions = { queryKey: 'getTopics' }) => {
	return useQuery({
		...queryOptions,
		queryFn: () => getTopics(requestOptions),
	});
};

const useGetTopic = (requestOptions, queryOptions = { queryKey: 'getTopic' }) => {
	return useQuery({
		...queryOptions,
		queryFn: _id => getTopic(_id, requestOptions),
	});
};

const usePostTopic = (requestOptions, mutateOptions = { queryKey: 'postTopic' }) => {
	return useMutation((_id, data) => postTopic(_id, data, requestOptions), {
		mutateOptions,
	});
};

const usePutTopic = (requestOptions, mutateOptions = { queryKey: 'putTopic' }) => {
	return useMutation((_id, data) => putTopic(_id, data, requestOptions), {
		mutateOptions,
	});
};

const usePatchTopic = (requestOptions, mutateOptions = { queryKey: 'patchTopic' }) => {
	return useMutation((_id, data) => patchTopic(_id, data, requestOptions), {
		mutateOptions,
	});
};

const useDeleteTopic = (requestOptions, queryOptions = { queryKey: 'deleteTopic' }) => {
	return useQuery({
		...queryOptions,
		queryFn: _id => deleteTopic(_id, requestOptions),
	});
};

export default {
	getTopics,
	getTopic,
	postTopic,
	putTopic,
	patchTopic,
	deleteTopic,
	useGetTopics,
	useGetTopic,
	usePostTopic,
	usePutTopic,
	usePatchTopic,
	useDeleteTopic,
};
