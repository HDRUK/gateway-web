import { ReactNode } from "react";
import { useTranslations } from "next-intl";
import useSWR, { KeyedMutator } from "swr";
import { Error } from "@/interfaces/Error";
import apiService from "@/services/api";

interface Response<T> {
    data: T | undefined;
    error: Error | undefined;
    isLoading: boolean;
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
    } = options || {};
    const t = useTranslations("api");

    const { data, error, mutate, isLoading } = useSWR<T>(
        [url, formData],
        () => {
            return apiService.postRequest<T>(url, formData, {
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
        },
        {
            keepPreviousData,
            revalidateOnFocus: false,
            revalidateOnMount: false,
            revalidateOnReconnect: false,
            refreshWhenOffline: false,
            refreshWhenHidden: false,
            refreshInterval: 0,
        }
    );

    return {
        error,
        isLoading,
        data,
        mutate,
    };
};

export default usePostSwr;
