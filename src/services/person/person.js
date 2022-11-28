import { addCmsGatewayApiHostname, apiPathV1, apiUrlV1 } from '../../configs/url.config';
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
    return getRequest(`${apiUrlV1}/person`, options);
};

const getPerson = (_id, options) => {
    return getRequest(addCmsGatewayApiHostname(`${apiPathV1}/person/${_id}`), options);
};

const postPerson = (_id, data, options) => {
    return postRequest(`${apiUrlV1}/person/${_id}`, data, options);
};

const putPerson = (_id, data, options) => {
    return putRequest(`${apiUrlV1}/person/${_id}`, data, options);
};

const putUnsubscribe = (_id, data, options) => {
    return putRequest(`${apiUrlV1}/person/unsubscribe/${_id}`, data, options);
};

const patchPerson = (_id, data, options) => {
    return patchRequest(`${apiUrlV1}/person/${_id}`, data, options);
};

const patchProfileComplete = (_id, data, options) => {
    return patchRequest(`${apiUrlV1}/person/profileComplete/${_id}`, data, options);
};

const deletePerson = (_id, options) => {
    return deleteRequest(`${apiUrlV1}/person/${_id}`, options);
};

const useGetPersons = (requestOptions, queryOptions) => {
    return useQueryWithTranslations({
        queryKey: 'person.getPersons',
        ...queryOptions,
        queryFn: () => getPersons(requestOptions),
    });
};

const useGetPerson = (requestOptions, mutateOptions) => {
    return useMutationWithTranslations(
        id => {
            return getPerson(id, requestOptions);
        },
        {
            mutationKey: 'person.getPerson',
            ...mutateOptions,
        }
    );
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
