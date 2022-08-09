import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery } from 'react-query';

export const getRequest = (url, options) => axios.get(url, options);

export const postRequest = (url, data, options) => axios.post(url, data, options);

export const putRequest = (url, data, options) => axios.put(url, data, options);

export const patchRequest = (url, data, options) => axios.patch(url, data, options);

export const deleteRequest = (url, options) => axios.delete(url, options);

const onErrorWithTranslation = (err, variables, context, onError, t, i18n, key) => {
    const messageKey = `services.errors.${key}.${err.response.status}.message`;
    const titleKey = `services.errors.${key}.${err.response.status}.title`;

    onError(
        {
            message: !i18n.exists(messageKey) ? t(`services.status.${err.response.status}.message`) : t(messageKey),
            title: !i18n.exists(titleKey) ? t(`services.status.${err.response.status}.title`) : t(titleKey),
        },
        err,
        variables,
        context
    );
};

export const useMutationWithTranslations = (mutatationFn, options = {}) => {
    const { t, i18n } = useTranslation();
    const { onError } = options;

    return useMutation(mutatationFn, {
        ...options,
        ...(onError && {
            onError: (err, variables, context) => onErrorWithTranslation(err, variables, context, onError, t, i18n, options.mutationKey),
        }),
    });
};

export const useQueryWithTranslations = (options = {}) => {
    const { t, i18n } = useTranslation();
    const { onError } = options;

    return useQuery({
        ...options,
        ...(onError && {
            onError: (err, variables, context) => onErrorWithTranslation(err, variables, context, onError, t, i18n, options.queryKey),
        }),
    });
};
