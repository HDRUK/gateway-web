import useSWR, { KeyedMutator } from "swr";
import { Error } from "@/interfaces/Error";
import apiService from "@/services/api";
import { useTranslation } from "next-i18next";
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
    itemName?: string;
    action?: ReactNode;
}

const useGet = <T>(url: string, options?: Options): Response<T> => {
    const { t, i18n } = useTranslation("api");
    const { localeKey, itemName, action } = options || {};

    const { data, error, mutate, isLoading } = useSWR<T>(url, () => {
        return apiService.getRequest(url, {
            notificationOptions: {
                localeKey,
                itemName,
                t,
                i18n,
                action,
            },
            withPagination: options?.withPagination,
        });
    });

    return {
        error,
        isLoading,
        data,
        mutate,
    };
};

export default useGet;
