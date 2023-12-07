import useSWR, { KeyedMutator } from "swr";
import { Error } from "@/interfaces/Error";
import apiService from "@/services/api";
import { useTranslations } from "next-intl";
import { ReactNode } from "react";

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
    itemName?: string;
    action?: ReactNode;
}

const useGet = <T>(url: string | null, options?: Options): Response<T> => {
    const {
        localeKey,
        itemName,
        action,
        keepPreviousData = false,
        errorNotificationsOn,
        shouldFetch = true,
        withPagination = false,
    } = options || {};
    const t = useTranslations("api");

    const { data, error, mutate, isLoading } = useSWR<T>(
        shouldFetch ? url : null,
        () => {
            return apiService.getRequest(url, {
                notificationOptions: {
                    localeKey,
                    itemName,
                    errorNotificationsOn,
                    t,
                    action,
                },
                withPagination,
            });
        },
        { keepPreviousData }
    );

    return {
        error,
        isLoading,
        data,
        mutate,
    };
};

export default useGet;
