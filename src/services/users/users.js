import { apiURL } from '../../configs/url.config';
import { getRequest, patchRequest, useMutationWithTranslations, useQueryWithTranslations } from '../../utils/requests';

const getUsers = options => {
	return getRequest(`${apiURL}/users`, options);
};

const patchRoles = (_id, data, options) => {
	return patchRequest(`${apiURL}/users/advancedsearch/roles/${_id}`, data, options);
};

const patchTerms = (_id, data, options) => {
	return patchRequest(`${apiURL}/users/advancedsearch/terms/${_id}`, data, options);
};

const useGetUsers = (requestOptions, queryOptions) => {
	return useQueryWithTranslations({
		queryKey: 'getUsers',
		...queryOptions,
		queryFn: () => getUsers(requestOptions),
	});
};

const usePatchRoles = (requestOptions, mutateOptions) => {
	return useMutationWithTranslations((_id, data) => patchRoles(_id, data, requestOptions), {
		queryKey: 'patchRoles',
		...mutateOptions,
	});
};

const usePatchTerms = (requestOptions, mutateOptions) => {
	return useMutationWithTranslations((_id, data) => patchTerms(_id, data, requestOptions), {
		queryKey: 'patchTerms',
		...mutateOptions,
	});
};

export default {
	getUsers,
	patchRoles,
	patchTerms,
	useGetUsers,
	usePatchRoles,
	usePatchTerms,
};
