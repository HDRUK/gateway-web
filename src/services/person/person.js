import { useMutation, useQuery } from 'react-query';
import { apiURL } from '../../configs/url.config';
import { deleteRequest, getRequest, patchRequest, postRequest, putRequest } from '../../utils/requests';

const getPersons = options => {
    return getRequest(`${apiURL}/person`, options);
};

const getPerson = (_id, options) => {
    return getRequest(`${apiURL}/person/${_id}`, options);
};

const postPerson = (_id, data, options) => {
    return postRequest(`${apiURL}/person/${_id}`, data, options);
};

const putPerson = (_id, data, options) => {
    return putRequest(`${apiURL}/person/${_id}`, data, options);
};

const putUnsubscribe = (_id, data, options) => {
    return putRequest(`${apiURL}/person/unsubscribe/${_id}`, data, options);
};

const patchPerson = (_id, data, options) => {
    return patchRequest(`${apiURL}/person/${_id}`, data, options);
};

const patchProfileComplete = (_id, data, options) => {
    return patchRequest(`${apiURL}/person/profileComplete/${_id}`, data, options);
};

const deletePerson = (_id, options) => {
    return deleteRequest(`${apiURL}/person/${_id}`, options);
};

const useGetPersons = (requestOptions, queryOptions = { queryKey: 'getPersons' }) => {
    return useQuery({
        ...queryOptions,
        queryFn: () => getPersons(requestOptions),
    });
};

const useGetPerson = (requestOptions, queryOptions = { queryKey: 'getPerson' }) => {
    return useQuery({
        ...queryOptions,
        queryFn: _id => getPerson(_id, requestOptions),
    });
};

const usePostPerson = (requestOptions, mutateOptions = { queryKey: 'postPerson' }) => {
    return useMutation((_id, data) => postPerson(_id, data, requestOptions), {
        mutateOptions,
    });
};

const usePutPerson = (requestOptions, mutateOptions = { queryKey: 'putPerson' }) => {
    return useMutation((_id, data) => putPerson(_id, data, requestOptions), {
        mutateOptions,
    });
};

const usePutUnsubscribe = (requestOptions, mutateOptions = { queryKey: 'putUnsubscribe' }) => {
    return useMutation((_id, data) => putUnsubscribe(_id, data, requestOptions), {
        mutateOptions,
    });
};

const usePatchPerson = (requestOptions, mutateOptions = { queryKey: 'patchPerson' }) => {
    return useMutation((_id, data) => patchPerson(_id, data, requestOptions), {
        mutateOptions,
    });
};

const usePatchProfileComplete = (requestOptions, mutateOptions = { queryKey: 'patchProfileComplete' }) => {
    return useMutation((_id, data) => patchProfileComplete(_id, data, requestOptions), {
        mutateOptions,
    });
};

const useDeletePerson = (requestOptions, queryOptions = { queryKey: 'deletePerson' }) => {
    return useQuery({
        ...queryOptions,
        queryFn: _id => deletePerson(_id, requestOptions),
    });
};

export default {
    getPersons,
    getPerson,
    postPerson,
    putPerson,
    putUnsubscribe,
    patchPerson,
    patchProfileComplete,
    deletePerson,
    useGetPersons,
    useGetPerson,
    usePostPerson,
    usePutPerson,
    usePutUnsubscribe,
    usePatchPerson,
    usePatchProfileComplete,
    useDeletePerson,
};
