import { useMutation } from 'react-query';
import { apiV2URL } from '../../configs/url.config';
import { postRequest } from '../../utils/requests';

const postActivityLog = (data, options) => {
	return postRequest(`${apiV2URL}/activitylog`, data, options);
};

const usePostActivityLog = (requestOptions, mutateOptions) => {
	return useMutation(data => postActivityLog(data, requestOptions), {
		mutationKey: 'postActivityLog',
		...mutateOptions,
	});
};

export default {
	postActivityLog,
	usePostActivityLog,
};
