import { ReactNode } from "react";
import { useTranslations } from "next-intl";
import useSWR, { KeyedMutator } from "swr";
import { Error as ApiError } from "@/interfaces/Error";
import apiService from "@/services/api";

interface Response<T> {
    data: T | undefined;
    error: ApiError | undefined;
    isLoading: boolean;
    isValidating: boolean;
    mutate: KeyedMutator<T>;
}

interface Options {
    localeKey?: string;
    withPagination?: boolean;
    shouldFetch?: boolean;
    keepPreviousData?: boolean;
    errorNotificationsOn?: boolean;
    successNotificationsOn?: boolean;
    itemName?: string;
    action?: ReactNode;
    revalidateOnMount?: boolean;
}

const usePostSwr = <T>(
    url: string,
    formData?: unknown,
    options?: Options
): Response<T> => {
    const {
        localeKey,
        itemName,
        action,
        keepPreviousData = false,
        successNotificationsOn = false,
        errorNotificationsOn,
        withPagination = false,
        shouldFetch = true,
        revalidateOnMount,
    } = options || {};
    const t = useTranslations("api");

    const { data, error, mutate, isLoading, isValidating } = useSWR<T>(
        shouldFetch ? [url, formData] : null,
        async () => {
            const response = await apiService.postRequest<T>(url, formData, {
                notificationOptions: {
                    localeKey,
                    itemName,
                    errorNotificationsOn,
                    successNotificationsOn,
                    t,
                    action,
                },
                withPagination,
            });

            if (response === null || response === undefined) {
                throw new Error(`POST ${url} failed`);
            }

            return response as T;
        },
        {
            keepPreviousData,
            revalidateOnFocus: false,
            revalidateIfStale: false,
            revalidateOnReconnect: false,
            refreshWhenOffline: false,
            refreshWhenHidden: false,
            refreshInterval: 0,
            errorRetryCount: 2,
            revalidateOnMount,
        }
    );

    return {
        error,
        isLoading,
        isValidating,
        data,
        mutate,
    };
};

export default usePostSwr;
