import { apiUrlV1, apiUrlV3 } from '../../configs/url.config';
import {
    deleteRequest,
    getRequest,
    patchRequest,
    postRequest,
    putRequest,
    useMutationWithTranslations,
    useQueryWithTranslations,
} from '../../utils/requests';

const getMembers = (_id, options) => {
    return getRequest(`${apiUrlV3}/teams/${_id}/members`, options);
};

const getNotifications = (_id, options) => {
    return getRequest(`${apiUrlV1}/teams/${_id}/notifications`, options);
};

const addMembers = (_id, data, options) => {
    return postRequest(`${apiUrlV3}/teams/${_id}/members`, data, options);
};

const postAdd = (data, options) => {
    return postRequest(`${apiUrlV1}/teams/add`, data, options);
};

const putTeam = (_id, data, options) => {
    return putRequest(`${apiUrlV1}/teams/${_id}`, data, options);
};

const putNotificationMessage = (_id, data, options) => {
    return putRequest(`${apiUrlV1}/teams/${_id}/notification-messages`, data, options);
};

const putNotifications = (_id, data, options) => {
    return putRequest(`${apiUrlV1}/teams/${_id}/notifications`, data, options);
};

const patchTeamMember = (teamId, userId, data, options) => {
    return patchRequest(`${apiUrlV3}/teams/${teamId}/members/${userId}`, data, options);
};

const usePatchTeamMemberRequest = (requestOptions, mutateOptions) => {
    return useMutationWithTranslations(({ teamId, userId, data }) => patchTeamMember(teamId, userId, data, requestOptions), {
        mutationKey: 'teams.patchMember',
        ...mutateOptions,
    });
};

const deleteTeamMember = (teamId, userId, options) => {
    return deleteRequest(`${apiUrlV3}/teams/${teamId}/members/${userId}`, options);
};

const useDeleteTeamMemberRequest = (requestOptions, mutateOptions) => {
    return useMutationWithTranslations(({ teamId, userId }) => deleteTeamMember(teamId, userId, requestOptions), {
        mutationKey: 'teams.deleteMember',
        ...mutateOptions,
    });
};

const useGetMembers = (requestOptions, mutateOptions) => {
    return useMutationWithTranslations(id => getMembers(id, requestOptions), {
        mutationKey: 'teams.getMembers',
        ...mutateOptions,
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

export {
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
    useDeleteTeamMemberRequest,
    usePatchTeamMemberRequest,
};
