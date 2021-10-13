import { useMutation, useQuery } from 'react-query';
import { apiURL } from '../configs/url.config';
import { deleteRequest, getRequest, patchRequest, postRequest, putRequest } from '../utils/requests';

const getTools = options => {
	return getRequest(`${apiURL}/tools/getList`, options);
};

const getTool = (_id, options) => {
	return getRequest(`${apiURL}/tools/${_id}`, options);
};

const getToolEdit = (_id, options) => {
	return getRequest(`${apiURL}/tools/edit/${_id}`, options);
};

const getProjectTag = (_id, options) => {
	return getRequest(`${apiURL}/tools/project/tag/${_id}`, options);
};

const postTool = (_id, data, options) => {
	return postRequest(`${apiURL}/tools/${_id}`, data, options);
};

const postReviewAdd = (data, options) => {
	return postRequest(`${apiURL}/tools/review/add`, data, options);
};

const postToolsReply = (data, options) => {
	return postRequest(`${apiURL}/tools/reply`, data, options);
};

const putTool = (_id, data, options) => {
	return putRequest(`${apiURL}/tools/${_id}`, data, options);
};

const putReviewApprove = (data, options) => {
	return putRequest(`${apiURL}/tools/review/approve`, data, options);
};

const patchTool = (_id, data, options) => {
	return patchRequest(`${apiURL}/tools/${_id}`, data, options);
};

const deleteTool = (_id, options) => {
	return deleteRequest(`${apiURL}/tools/${_id}`, options);
};

const useGetTools = (requestOptions, queryOptions = { queryKey: 'getTools' }) => {
	return useQuery({
		...queryOptions,
		queryFn: () => getTools(requestOptions),
	});
};

const useGetTool = (requestOptions, queryOptions = { queryKey: 'getTool' }) => {
	return useQuery({
		...queryOptions,
		queryFn: _id => getTool(_id, requestOptions),
	});
};

const useGetToolEdit = (requestOptions, queryOptions = { queryKey: 'getToolEdit' }) => {
	return useQuery({
		...queryOptions,
		queryFn: _id => getToolEdit(_id, requestOptions),
	});
};

const useGetProjectTag = (requestOptions, queryOptions = { queryKey: 'getProjectTag' }) => {
	return useQuery({
		...queryOptions,
		queryFn: _id => getProjectTag(_id, requestOptions),
	});
};

const usePostTool = (requestOptions, mutateOptions = { queryKey: 'postTool' }) => {
	return useMutation((_id, data) => postTool(_id, data, requestOptions), {
		mutateOptions,
	});
};

const usePostReviewAdd = (requestOptions, mutateOptions = { queryKey: 'postReviewAdd' }) => {
	return useMutation(data => postReviewAdd(data, requestOptions), {
		mutateOptions,
	});
};

const usePostToolsReply = (requestOptions, mutateOptions = { queryKey: 'postToolsReply' }) => {
	return useMutation(data => postToolsReply(data, requestOptions), {
		mutateOptions,
	});
};

const usePutTool = (requestOptions, mutateOptions = { queryKey: 'putTool' }) => {
	return useMutation((_id, data) => putTool(_id, data, requestOptions), {
		mutateOptions,
	});
};

const usePutReviewApprove = (requestOptions, mutateOptions = { queryKey: 'putReviewApprove' }) => {
	return useMutation((_id, data) => putReviewApprove(_id, data, requestOptions), {
		mutateOptions,
	});
};

const usePatchTool = (requestOptions, mutateOptions = { queryKey: 'patchTool' }) => {
	return useMutation((_id, data) => patchTool(_id, data, requestOptions), {
		mutateOptions,
	});
};

const useDeleteTool = (requestOptions, queryOptions = { queryKey: 'deleteTool' }) => {
	return useQuery({
		...queryOptions,
		queryFn: _id => deleteTool(_id, requestOptions),
	});
};

export default {
	getTools,
	getTool,
	getToolEdit,
	getProjectTag,
	postTool,
	postReviewAdd,
	postToolsReply,
	putTool,
	putReviewApprove,
	patchTool,
	deleteTool,
	useGetTools,
	useGetTool,
	useGetToolEdit,
	useGetProjectTag,
	usePostTool,
	usePostReviewAdd,
	usePostToolsReply,
	usePutTool,
	usePutReviewApprove,
	usePatchTool,
	useDeleteTool,
};
