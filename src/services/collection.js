import { useMutation, useQuery } from 'react-query';
import { apiURL } from '../configs/url.config';
import { getRequest, postRequest } from '../utils/requests';

export const getCollectionRequest = (_id, options) => {
	return getRequest(`${apiURL}/collections/${_id}`, options);
};

export const getCollectionRelatedObjectsRequest = (_id, options) => {
	return getRequest(`${apiURL}/collections/relatedobjects/${_id}`, options);
};

export const postCollectionCounterUpdateRequest = (data, options) => {
	return postRequest(`${apiURL}/collectioncounter/update`, data, options);
};

const useGetCollectionRequest = (requestOptions, queryOptions = { queryKey: 'getCollectionRequest' }) => {
	return useQuery({
		...queryOptions,
		queryFn: _id => getCollectionRequest(_id, requestOptions),
	});
};

const useGetCollectionRelatedObjectsRequest = (requestOptions, queryOptions = { queryKey: 'getCollectionRelatedObjectsRequest' }) => {
	return useQuery({
		...queryOptions,
		queryFn: _id => getCollectionRelatedObjectsRequest(_id, requestOptions),
	});
};

const usePostCollectionCounterUpdateRequest = (requestOptions, mutateOptions = { queryKey: 'postCollectionCounterUpdateRequest' }) => {
	return useMutation((data) => postCollectionCounterUpdateRequest(data, requestOptions), {
		mutateOptions,
	});
};

export default {
    useGetCollectionRequest,
    useGetCollectionRelatedObjectsRequest,
    usePostCollectionCounterUpdateRequest
}
