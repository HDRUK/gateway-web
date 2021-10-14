import { useMutation, useQuery } from 'react-query';
import { apiURL } from '../configs/url.config';
import { deleteRequest, getRequest, patchRequest, postRequest, putRequest } from '../utils/requests';

const getMessages = options => {
	return getRequest(`${apiURL}/messages`, options);
};

const getMessage = (_id, options) => {
	return getRequest(`${apiURL}/messages/${_id}`, options);
};

const getUnreadCount = options => {
	return getRequest(`${apiURL}/messages/unread/count`, options);
};

const postMessage = (_id, data, options) => {
	return postRequest(`${apiURL}/messages/${_id}`, data, options);
};

const postMarkAsRead = (data, options) => {
	return postRequest(`${apiURL}/messages/markasread`, data, options);
};

const putMessage = (_id, data, options) => {
	return putRequest(`${apiURL}/messages/${_id}`, data, options);
};

const patchMessage = (_id, data, options) => {
	return patchRequest(`${apiURL}/messages/${_id}`, data, options);
};

const deleteMessage = (_id, options) => {
	return deleteRequest(`${apiURL}/messages/${_id}`, options);
};

const useGetMessages = (requestOptions, queryOptions = { queryKey: 'getMessages' }) => {
	return useQuery({
		...queryOptions,
		queryFn: () => getMessages(requestOptions),
	});
};

const useGetMessage = (requestOptions, queryOptions = { queryKey: 'getMessage' }) => {
	return useQuery({
		...queryOptions,
		queryFn: _id => getMessage(_id, requestOptions),
	});
};

const useGetUnreadCount = (requestOptions, queryOptions = { queryKey: 'getUnreadCount' }) => {
	return useQuery({
		...queryOptions,
		queryFn: () => getUnreadCount(requestOptions),
	});
};

const usePostMessage = (requestOptions, mutateOptions = { queryKey: 'postMessage' }) => {
	return useMutation((_id, data) => postMessage(_id, data, requestOptions), {
		mutateOptions,
	});
};

const usePostMarkAsRead = (requestOptions, mutateOptions = { queryKey: 'postMarkAsRead' }) => {
	return useMutation(data => postMarkAsRead(data, requestOptions), {
		mutateOptions,
	});
};

const usePutMessage = (requestOptions, mutateOptions = { queryKey: 'putMessage' }) => {
	return useMutation((_id, data) => putMessage(_id, data, requestOptions), {
		mutateOptions,
	});
};

const usePatchMessage = (requestOptions, mutateOptions = { queryKey: 'patchMessage' }) => {
	return useMutation((_id, data) => patchMessage(_id, data, requestOptions), {
		mutateOptions,
	});
};

const useDeleteMessage = (requestOptions, queryOptions = { queryKey: 'deleteMessage' }) => {
	return useQuery({
		...queryOptions,
		queryFn: _id => deleteMessage(_id, requestOptions),
	});
};

export default {
	getMessages,
	getMessage,
	getUnreadCount,
	postMessage,
	postMarkAsRead,
	putMessage,
	patchMessage,
	deleteMessage,
	useGetMessages,
	useGetMessage,
	useGetUnreadCount,
	usePostMessage,
	usePostMarkAsRead,
	usePutMessage,
	usePatchMessage,
	useDeleteMessage,
};
