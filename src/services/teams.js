import { useMutation, useQuery } from 'react-query';
import { apiURL } from '../configs/url.config';
import { getRequest, postRequest, putRequest } from '../utils/requests';

const getMembers = (_id, options) => {
	return getRequest(`${apiURL}/teams/${_id}/members`, options);
};

const getNotifications = (_id, options) => {
	return getRequest(`${apiURL}/teams/${_id}/notifications`, options);
};

const postAdd = (data, options) => {
	return postRequest(`${apiURL}/teams/add`, data, options);
};

const putTeam = (_id, data, options) => {
	return putRequest(`${apiURL}/teams/${_id}`, data, options);
};

const putNotificationMessage = (_id, data, options) => {
	return putRequest(`${apiURL}/teams/${_id}/notification-messages`, data, options);
};

const putNotifications = (_id, data, options) => {
	return putRequest(`${apiURL}/teams/${_id}/notifications`, data, options);
};

const useGetMembers = (requestOptions, queryOptions = { queryKey: 'getMembers' }) => {
	return useQuery({
		...queryOptions,
		queryFn: _id => getMembers(_id, requestOptions),
	});
};

const useGetNotifications = (requestOptions, queryOptions = { queryKey: 'getNotifications' }) => {
	return useQuery({
		...queryOptions,
		queryFn: _id => getNotifications(_id, requestOptions),
	});
};

const usePostAdd = (requestOptions, mutateOptions = { queryKey: 'postAdd' }) => {
	return useMutation(data => postAdd(data, requestOptions), {
		mutateOptions,
	});
};

const usePutTeam = (requestOptions, mutateOptions = { queryKey: 'putDatasetOnboarding' }) => {
	return useMutation((_id, data) => putTeam(_id, data, requestOptions), {
		mutateOptions,
	});
};

const usePutNotificationMessage = (requestOptions, mutateOptions = { queryKey: 'putNotificationMessage' }) => {
	return useMutation((_id, data) => putNotificationMessage(_id, data, requestOptions), {
		mutateOptions,
	});
};

const usePutNotifications = (requestOptions, mutateOptions = { queryKey: 'putNotifications' }) => {
	return useMutation((_id, data) => putNotifications(_id, data, requestOptions), {
		mutateOptions,
	});
};

export default {
	getMembers,
	getNotifications,
	postAdd,
	putTeam,
	putNotificationMessage,
	putNotifications,
	useGetMembers,
	useGetNotifications,
	usePostAdd,
	usePutTeam,
	usePutNotificationMessage,
	usePutNotifications,
};
