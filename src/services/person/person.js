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

const useGetPersons = (requestOptions, queryOptions) => {
    return useQueryWithTranslations({
        queryKey: 'person.getPersons',
        ...queryOptions,
        queryFn: () => getPersons(requestOptions),
    });
};

const useGetPerson = (requestOptions, queryOptions) => {
    return useQueryWithTranslations({
        queryKey: 'person.getPerson',
        ...queryOptions,
        queryFn: _id => getPerson(_id, requestOptions),
    });
};

const usePostPerson = (requestOptions, mutateOptions) => {
    return useMutationWithTranslations((_id, data) => postPerson(_id, data, requestOptions), {
        mutationKey: 'person.postPerson',
        ...mutateOptions,
    });
};

const usePutPerson = (requestOptions, mutateOptions) => {
    return useMutationWithTranslations((_id, data) => putPerson(_id, data, requestOptions), {
        mutationKey: 'person.putPerson',
        ...mutateOptions,
    });
};

const usePutUnsubscribe = (requestOptions, mutateOptions) => {
    return useMutationWithTranslations((_id, data) => putUnsubscribe(_id, data, requestOptions), {
        mutationKey: 'person.putUnsubscribe',
        ...mutateOptions,
    });
};

const usePatchPerson = (requestOptions, mutateOptions) => {
    return useMutationWithTranslations((_id, data) => patchPerson(_id, data, requestOptions), {
        mutationKey: 'person.patchPerson',
        ...mutateOptions,
    });
};

const usePatchProfileComplete = (requestOptions, mutateOptions) => {
    return useMutationWithTranslations((_id, data) => patchProfileComplete(_id, data, requestOptions), {
        mutationKey: 'person.patchProfileComplete',
        ...mutateOptions,
    });
};

const useDeletePerson = (requestOptions, queryOptions) => {
    return useQueryWithTranslations({
        queryKey: 'person.deletePerson',
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
