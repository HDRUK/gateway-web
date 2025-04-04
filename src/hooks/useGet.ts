import { ReactNode } from "react";
import { useTranslations } from "next-intl";
import useSWR, { KeyedMutator } from "swr";
import apiService from "@/services/api";

interface Response<T> {
    data: T | undefined;
    isLoading: boolean;
    mutate: KeyedMutator<T | undefined>;
}

interface Options<T> {
    localeKey?: string;
    withPagination?: boolean;
    shouldFetch?: boolean;
    keepPreviousData?: boolean;
    errorNotificationsOn?: boolean;
    itemName?: string;
    action?: ReactNode;
    refreshInterval?: number;
    fallbackData?: T;
    revalidateOnMount?: boolean;
}

const useGet = <T>(url: string | null, options?: Options<T>): Response<T> => {
    const {
        localeKey,
        itemName,
        action,
        keepPreviousData = false,
        errorNotificationsOn,
        shouldFetch = true,
        withPagination = false,
        refreshInterval = false,
        fallbackData,
        revalidateOnMount,
        // fallbackData = "TESTEVRG",
    } = options || {};

    const t = useTranslations("api");

    // console.log("fallbackData", fallbackData);

    const fetcher = async (url: string | null): Promise<T | undefined> => {
        if (!url) return undefined;

        try {
            const data = await apiService.getRequest<T>(url, {
                withPagination,
                notificationOptions: {
                    localeKey,
                    itemName,
                    errorNotificationsOn,
                    t,
                    action,
                },
            });

            return data as T;
        } catch (error) {
            console.error("Error fetching data:", error);
            throw error;
        }
    };

    const { data, mutate, isLoading } = useSWR<T | undefined>(
        shouldFetch ? url : null,
        fetcher,
        { keepPreviousData, refreshInterval, fallbackData }
    );

    return {
        isLoading,
        data,
        mutate,
    };
};

export default useGet;
