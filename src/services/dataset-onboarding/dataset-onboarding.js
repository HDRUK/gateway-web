import { useMutation, useQuery } from 'react-query';
import { apiURL } from '../../configs/url.config';
import { deleteRequest, getRequest, patchRequest, postRequest, putRequest } from '../../utils/requests';

const getDatasetOnboardings = options => {
	return getRequest(`${apiURL}/dataset-onboarding`, options);
};

const getDatasetOnboarding = (_id, options) => {
	return getRequest(`${apiURL}/dataset-onboarding/${_id}`, options);
};

const getPublisher = (_id, options) => {
	return getRequest(`${apiURL}/dataset-onboarding/publisher/${_id}`, options);
};

const postDatasetOnboarding = (_id, data, options) => {
	return postRequest(`${apiURL}/dataset-onboarding/${_id}`, data, options);
};

const postDuplicate = (_id, data, options) => {
	return postRequest(`${apiURL}/dataset-onboarding/duplicate/${_id}`, data, options);
};

const putDatasetOnboarding = (_id, data, options) => {
	return putRequest(`${apiURL}/dataset-onboarding/${_id}`, data, options);
};

const patchDatasetOnboarding = (_id, data, options) => {
	return patchRequest(`${apiURL}/dataset-onboarding/${_id}`, data, options);
};

const deleteDatasetOnboarding = (_id, options) => {
	return deleteRequest(`${apiURL}/dataset-onboarding/delete/${_id}`, options);
};

const useGetDatasetOnboardings = (requestOptions, queryOptions) => {
	return useQuery({
		queryKey: 'getDatasetOnboardings',
		...queryOptions,
		queryFn: () => getDatasetOnboardings(requestOptions),
	});
};

const useGetDatasetOnboarding = (requestOptions, queryOptions) => {
	return useQuery({
		queryKey: 'getDatasetOnboarding',
		...queryOptions,
		queryFn: _id => getDatasetOnboarding(_id, requestOptions),
	});
};

const useGetPublisher = (publisherId, requestOptions, mutateOptions) => {
	const _id = Array.isArray(publisherId) ? publisherId[0] : publisherId;

	return useMutation(
		params => {
			return getPublisher(_id, { params }, requestOptions);
		},
		{
			mutationKey: 'getPublisher',
			...mutateOptions,
		}
	);
};

const usePostDatasetOnboarding = (data, requestOptions, queryOptions) => {
	return useQuery({
		queryKey: 'postDatasetOnboarding',
		...queryOptions,
		queryKey: [queryOptions.queryKey, _id],
		queryFn: async ({ queryKey }) => getPublisher(queryKey[1], requestOptions),
	});
};

const usePostDatasetOnboarding = (requestOptions, mutateOptions = { queryKey: 'postDatasetOnboarding' }) => {
	return useMutation((_id, data) => postDatasetOnboarding(_id, data, requestOptions), {
		mutateOptions,
	});
};

const usePostDuplicate = (requestOptions, mutateOptions) => {
	return useMutation((_id, data) => postDuplicate(_id, data, requestOptions), {
		mutationKey: 'postDuplicate',
		...mutateOptions,
	});
};

const usePutDatasetOnboarding = (requestOptions, mutateOptions) => {
	return useMutation((_id, data) => putDatasetOnboarding(_id, data, requestOptions), {
		mutationKey: 'putDatasetOnboarding',
		...mutateOptions,
	});
};

const usePatchDatasetOnboarding = (requestOptions, mutateOptions) => {
	return useMutation((_id, data) => patchDatasetOnboarding(_id, data, requestOptions), {
		mutationKey: 'patchDatasetOnboarding',
		...mutateOptions,
	});
};

const useDeleteDatasetOnboarding = (requestOptions, queryOptions) => {
	return useQuery({
		queryKey: 'deleteDatasetOnboarding',
		...queryOptions,
		queryFn: _id => deleteDatasetOnboarding(_id, requestOptions),
	});
};

export default {
	getDatasetOnboardings,
	getDatasetOnboarding,
	getPublisher,
	postDatasetOnboarding,
	postDuplicate,
	putDatasetOnboarding,
	patchDatasetOnboarding,
	deleteDatasetOnboarding,
	useGetDatasetOnboardings,
	useGetDatasetOnboarding,
	useGetPublisher,
	usePostDatasetOnboarding,
	usePostDuplicate,
	usePutDatasetOnboarding,
	usePatchDatasetOnboarding,
	useDeleteDatasetOnboarding,
};
