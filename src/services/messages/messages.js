import { apiURL } from '../../configs/url.config';
import {
    deleteRequest,
    getRequest,
    patchRequest,
    postRequest,
    putRequest,
    useMutationWithTranslations,
    useQueryWithTranslations,
} from '../../utils/requests';

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

const useGetMessages = (requestOptions, queryOptions) => {
    return useQueryWithTranslations({
        queryKey: 'messages.getMessages',
        ...queryOptions,
        queryFn: () => getMessages(requestOptions),
    });
};

const useGetMessage = (requestOptions, queryOptions) => {
    return useQueryWithTranslations({
        queryKey: 'messages.getMessage',
        ...queryOptions,
        queryFn: _id => getMessage(_id, requestOptions),
    });
};

const useGetUnreadCount = (requestOptions, queryOptions) => {
    return useQueryWithTranslations({
        queryKey: 'messages.getUnreadCount',
        ...queryOptions,
        queryFn: () => getUnreadCount(requestOptions),
    });
};

const usePostMessage = (requestOptions, mutateOptions) => {
    return useMutationWithTranslations((_id, data) => postMessage(_id, data, requestOptions), {
        mutationKey: 'messages.postMessage',
        ...mutateOptions,
    });
};

const usePostMarkAsRead = (requestOptions, mutateOptions) => {
    return useMutationWithTranslations(data => postMarkAsRead(data, requestOptions), {
        mutationKey: 'messages.postMarkAsRead',
        ...mutateOptions,
    });
};

const usePutMessage = (requestOptions, mutateOptions) => {
    return useMutationWithTranslations((_id, data) => putMessage(_id, data, requestOptions), {
        mutationKey: 'messages.putMessage',
        ...mutateOptions,
    });
};

const usePatchMessage = (requestOptions, mutateOptions) => {
    return useMutationWithTranslations((_id, data) => patchMessage(_id, data, requestOptions), {
        mutationKey: 'messages.patchMessage',
        ...mutateOptions,
    });
};

const useDeleteMessage = (requestOptions, queryOptions) => {
    return useQueryWithTranslations({
        queryKey: 'messages.deleteMessage',
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
