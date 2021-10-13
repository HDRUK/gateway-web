import { useMutation, useQuery } from 'react-query';
import { apiURL } from '../configs/url.config';
import { deleteRequest, getRequest, patchRequest, postRequest, putRequest } from '../utils/requests';

const getProjects = options => {
	return getRequest(`${apiURL}/projects/getList`, options);
};

const getProject = (_id, options) => {
	return getRequest(`${apiURL}/projects/${_id}`, options);
};

const postProject = (_id, data, options) => {
	return postRequest(`${apiURL}/projects/${_id}`, data, options);
};

const putProject = (_id, data, options) => {
	return putRequest(`${apiURL}/projects/${_id}`, data, options);
};

const patchProject = (_id, data, options) => {
	return patchRequest(`${apiURL}/projects/${_id}`, data, options);
};

const deleteProject = (_id, options) => {
	return deleteRequest(`${apiURL}/projects/${_id}`, options);
};

const useGetProjects = (requestOptions, queryOptions = { queryKey: 'getProjects' }) => {
	return useQuery({
		...queryOptions,
		queryFn: () => getProjects(requestOptions),
	});
};

const useGetProject = (requestOptions, queryOptions = { queryKey: 'getProject' }) => {
	return useQuery({
		...queryOptions,
		queryFn: _id => getProject(_id, requestOptions),
	});
};

const usePostProject = (requestOptions, mutateOptions = { queryKey: 'postProject' }) => {
	return useMutation((_id, data) => postProject(_id, data, requestOptions), {
		mutateOptions,
	});
};

const usePutProject = (requestOptions, mutateOptions = { queryKey: 'putProject' }) => {
	return useMutation((_id, data) => putProject(_id, data, requestOptions), {
		mutateOptions,
	});
};

const usePatchProject = (requestOptions, mutateOptions = { queryKey: 'patchProject' }) => {
	return useMutation((_id, data) => patchProject(_id, data, requestOptions), {
		mutateOptions,
	});
};

const useDeleteProject = (requestOptions, queryOptions = { queryKey: 'deleteProject' }) => {
	return useQuery({
		...queryOptions,
		queryFn: _id => deleteProject(_id, requestOptions),
	});
};

export default {
	getProjects,
	getProject,
	postProject,
	putProject,
	patchProject,
	deleteProject,
	useGetProjects,
	useGetProject,
	usePostProject,
	usePutProject,
	usePatchProject,
	useDeleteProject,
};
