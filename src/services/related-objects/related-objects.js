import { apiUrlV1 } from '../../configs/url.config';
import { getRequest, useMutationWithTranslations } from '../../utils/requests';

const getRelatedObject = (_id, options) => {
    return getRequest(`${apiUrlV1}/relatedobject/${_id}`, options);
};

const getRelatedObjectByType = (_id, type, options) => {
    return getRequest(`${apiUrlV1}/relatedobject/${type}/${_id}`, options);
};

const getRelatedObjectForCourse = (_id, options) => {
    return getRequest(`${apiUrlV1}/relatedobject/course/${_id}`, options);
};

const getLinkedDatasets = (relation, options) => {
    return getRequest(`${apiUrlV1}/relatedobject/linkeddatasets/${relation}`, options);
};

const useGetRelatedObject = (requestOptions, mutateOptions) => {
    return useMutationWithTranslations(_id => getRelatedObject(_id, requestOptions), {
        mutationKey: 'relatedobjects.getRelatedObject',
        ...mutateOptions,
    });
};

const useGetRelatedObjectByType = (requestOptions, mutateOptions) => {
    return useMutationWithTranslations(
        data => {
            const { _id, type } = data;

            return getRelatedObjectByType(_id, type, requestOptions);
        },
        {
            mutationKey: 'relatedobjects.getRelatedObjectByType',
            ...mutateOptions,
        }
    );
};

const useGetRelatedObjectForCourse = (requestOptions, mutateOptions) => {
    return useMutationWithTranslations(_id => getRelatedObjectForCourse(_id, requestOptions), {
        mutationKey: 'relatedobjects.getRelatedObjectForCourse',
        ...mutateOptions,
    });
};

const useGetLinkedDatasets = (requestOptions, mutateOptions) => {
    return useMutationWithTranslations(relation => getLinkedDatasets(relation, requestOptions), {
        mutationKey: 'relatedobjects.getLinkedDatasets',
        ...mutateOptions,
    });
};

export {
    getRelatedObject,
    getRelatedObjectByType,
    getRelatedObjectForCourse,
    getLinkedDatasets,
    useGetRelatedObject,
    useGetRelatedObjectByType,
    useGetRelatedObjectForCourse,
    useGetLinkedDatasets,
};
