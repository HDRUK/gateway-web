import { useMutation, useQuery } from 'react-query';
import { apiURL } from '../configs/url.config';
import { postRequest, putRequest } from '../utils/requests';

const postWorkflow = (data, options) => {
	return postRequest(`${apiURL}/workflows`, data, options);
};

const putWorkflow = (_id, data, options) => {
	return putRequest(`${apiURL}/workflows/${_id}`, data, options);
};

const deleteWorkflow = (_id, options) => {
	return putRequest(`${apiURL}/workflows/${_id}`, options);
};

const usePostWorkflow = (requestOptions, mutateOptions = { queryKey: 'postWorkflow' }) => {
	return useMutation(data => postWorkflow(data, requestOptions), {
		mutateOptions,
	});
};

const usePutWorkflow = (requestOptions, mutateOptions = { queryKey: 'putWorkflow' }) => {
	return useMutation((_id, data) => putWorkflow(_id, data, requestOptions), {
		mutateOptions,
	});
};

export const useDeleteWorkflow = (requestOptions, queryOptions = { queryKey: 'deleteWorkflow' }) => {
	return useQuery({
		...queryOptions,
		queryFn: _id => deleteWorkflow(_id, requestOptions),
	});
};

export default {
	postWorkflow,
	putWorkflow,
	deleteWorkflow,
	usePostWorkflow,
	usePutWorkflow,
	useDeleteWorkflow,
};
