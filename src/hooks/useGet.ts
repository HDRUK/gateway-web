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
    itemName?: string;
    action?: ReactNode;
}

const useGet = <T>(key: string, options?: Options): Response<T> => {
    const { t, i18n } = useTranslation("api");
    const { localeKey, itemName, action } = options || {};
    const { data, error, mutate } = useSWR<T>(key, () =>
        apiService.getRequest(key, {
            notificationOptions: {
                localeKey,
                itemName,
                t,
                i18n,
                action,
            },
        })
    );

    return {
        error,
        isLoading: !data && !error,
        data,
        mutate,
    };
};

export default useGet;
