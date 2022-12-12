import { apiURL } from '../../configs/url.config';
import { getRequest, postRequest, putRequest, useMutationWithTranslations, useQueryWithTranslations } from '../../utils/requests';

const getMembers = (_id, options) => {
    return getRequest(`${apiURL}/teams/${_id}/members`, options);
};

const getNotifications = (_id, options) => {
    return getRequest(`${apiURL}/teams/${_id}/notifications`, options);
};

const addMembers = (_id, data, options) => {
    return postRequest(`${apiURL}/teams/${_id}/members`, data, options);
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

const useGetMembers = (requestOptions, queryOptions) => {
    return useQueryWithTranslations({
        queryKey: 'teams.getMembers',
        ...queryOptions,
        queryFn: _id => getMembers(_id, requestOptions),
    });
};

const useGetNotifications = (requestOptions, queryOptions) => {
    return useQueryWithTranslations({
        queryKey: 'teams.getNotifications',
        ...queryOptions,
        queryFn: _id => getNotifications(_id, requestOptions),
    });
};

const usePostAdd = (requestOptions, mutateOptions) => {
    return useMutationWithTranslations(data => postAdd(data, requestOptions), {
        queryKey: 'teams.postAdd',
        ...mutateOptions,
    });
};

const usePutTeam = (requestOptions, mutateOptions) => {
    return useMutationWithTranslations((_id, data) => putTeam(_id, data, requestOptions), {
        mutationKey: 'teams.putDatasetOnboarding',
        ...mutateOptions,
    });
};

const useAddMembers = (requestOptions, mutateOptions) => {
    return useMutationWithTranslations(({ id, data }) => addMembers(id, data, requestOptions), {
        mutationKey: 'teams.addMembers',
        ...mutateOptions,
    });
};

const usePutNotificationMessage = (requestOptions, mutateOptions) => {
    return useMutationWithTranslations((_id, data) => putNotificationMessage(_id, data, requestOptions), {
        mutationKey: 'teams.putNotificationMessage',
        ...mutateOptions,
    });
};

const usePutNotifications = (requestOptions, mutateOptions) => {
    return useMutationWithTranslations((_id, data) => putNotifications(_id, data, requestOptions), {
        mutationKey: 'teams.putNotifications',
        ...mutateOptions,
    });
};

export default {
    getMembers,
    getNotifications,
    addMembers,
    postAdd,
    putTeam,
    putNotificationMessage,
    putNotifications,
    useGetMembers,
    useGetNotifications,
    usePostAdd,
    usePutTeam,
    useAddMembers,
    usePutNotificationMessage,
    usePutNotifications,
};
