import { ReactNode } from "react";
import { useTranslations } from "next-intl";
import useSWR, { KeyedMutator } from "swr";
import apiService from "@/services/api";

interface Response<T> {
    data: T | undefined;
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

    const { data, mutate, isLoading } = useSWR(
        shouldFetch ? url : null,
        () => {
            return apiService.getRequest<T>(url, {
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
        isLoading,
        data,
        mutate,
    };
};

export default useGet;
