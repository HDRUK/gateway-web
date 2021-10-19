import { useMutation, useQuery } from 'react-query';
import { apiURL } from '../configs/url.config';
import { deleteRequest, getRequest, patchRequest, postRequest, putRequest } from '../utils/requests';

const getDataAccessRequests = options => {
	return getRequest(`${apiURL}/data-access-request`, options);
};

const getDataAccessRequest = (_id, options) => {
	return getRequest(`${apiURL}/data-access-request/${_id}`, options);
};

const getDatasets = (_id, options) => {
	return getRequest(`${apiURL}/data-access-request/datasets`, options);
};

const postDataAccessRequest = (_id, data, options) => {
	return postRequest(`${apiURL}/data-access-request/${_id}`, data, options);
};

const postRequestAmendments = (_id, data, options) => {
	return postRequest(`${apiURL}/data-access-request/${_id}/requestAmendments`, data, options);
};

const postMessages = (_id, data, options) => {
	return postRequest(`${apiURL}/data-access-request/${_id}/messages`, data, options);
};

const postAmendments = (_id, data, options) => {
	return postRequest(`${apiURL}/data-access-request/${_id}/amendments`, data, options);
};

const postActions = (_id, data, options) => {
	return postRequest(`${apiURL}/data-access-request/${_id}/actions`, data, options);
};

const putDataAccessRequest = (_id, data, options) => {
	return putRequest(`${apiURL}/data-access-request/${_id}`, data, options);
};

const patchDataAccessRequest = (_id, data, options) => {
	return patchRequest(`${apiURL}/data-access-request/${_id}`, data, options);
};

const deleteDataAccessRequest = (_id, options) => {
	return deleteRequest(`${apiURL}/data-access-request/${_id}`, options);
};

const useGetDataAccessRequests = (requestOptions, queryOptions = { queryKey: 'getDataAccessRequests' }) => {
	return useQuery({
		...queryOptions,
		queryFn: () => getDataAccessRequests(requestOptions),
	});
};

const useGetDataAccessRequest = (requestOptions, queryOptions = { queryKey: 'getDataAccessRequest' }) => {
	return useQuery({
		...queryOptions,
		queryFn: _id => getDataAccessRequest(_id, requestOptions),
	});
};

const useGetDatasets = (requestOptions, queryOptions = { queryKey: 'getDatasets' }) => {
	return useQuery({
		...queryOptions,
		queryFn: () => getDatasets(requestOptions),
	});
};

const usePostDataAccessRequest = (requestOptions, mutateOptions = { queryKey: 'postActions' }) => {
	return useMutation((_id, data) => postDataAccessRequest(_id, data, requestOptions), {
		mutateOptions,
	});
};

const usePostRequestAmendments = (requestOptions, mutateOptions = { queryKey: 'postRequestAmendments' }) => {
	return useMutation((_id, data) => postRequestAmendments(_id, data, requestOptions), {
		mutateOptions,
	});
};

const usePostActions = (requestOptions, mutateOptions = { queryKey: 'postActions' }) => {
	return useMutation((_id, data) => postActions(_id, data, requestOptions), {
		mutateOptions,
	});
};

const usePostAmendments = (requestOptions, mutateOptions = { queryKey: 'postAmendments' }) => {
	return useMutation((_id, data) => postAmendments(_id, data, requestOptions), {
		mutateOptions,
	});
};

const usePostMessages = (requestOptions, mutateOptions = { queryKey: 'postMessages' }) => {
	return useMutation((_id, data) => postMessages(_id, data, requestOptions), {
		mutateOptions,
	});
};

const usePutDataAccessRequest = (requestOptions, mutateOptions = { queryKey: 'putDataAccessRequest' }) => {
	return useMutation((_id, data) => putDataAccessRequest(_id, data, requestOptions), {
		mutateOptions,
	});
};

const usePatchDataAccessRequest = (requestOptions, mutateOptions = { queryKey: 'patchDataAccessRequest' }) => {
	return useMutation((_id, data) => patchDataAccessRequest(_id, data, requestOptions), {
		mutateOptions,
	});
};

const useDeleteDataAccessRequest = (requestOptions, queryOptions = { queryKey: 'deleteDataAccessRequest' }) => {
	return useQuery({
		...queryOptions,
		queryFn: _id => deleteDataAccessRequest(_id, requestOptions),
	});
};

export default {
	getDataAccessRequests,
	getDataAccessRequest,
	getDatasets,
	postDataAccessRequest,
	postRequestAmendments,
	postMessages,
	postActions,
	postAmendments,
	putDataAccessRequest,
	patchDataAccessRequest,
	deleteDataAccessRequest,
	useGetDataAccessRequests,
	useGetDataAccessRequest,
	useGetDatasets,
	usePostDataAccessRequest,
	usePostRequestAmendments,
	usePostActions,
	usePostAmendments,
	usePostMessages,
	usePutDataAccessRequest,
	usePatchDataAccessRequest,
	useDeleteDataAccessRequest,
};