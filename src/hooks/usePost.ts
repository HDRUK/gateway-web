import { MutatorOptions, useSWRConfig } from "swr";
import apiService from "@/services/api";
import { useTranslation } from "next-i18next";
import { ReactNode } from "react";
import useGet from "./useGet";

interface Options extends MutatorOptions {
    localeKey?: string;
    itemName?: string;
    action?: ReactNode;
}

const usePost = <T>(key: string, options?: Options) => {
    const { mutate } = useSWRConfig();
    const { data } = useGet(key);
    const { t, i18n } = useTranslation("api");
    const { localeKey, itemName, action, ...mutatorOptions } = options || {};

    return (payload: Omit<T, "id">) => {
        mutate(
            key,
            async () => {
                const id = await apiService.postRequest(key, payload, {
                    notificationOptions: {
                        localeKey,
                        itemName,
                        t,
                        i18n,
                        action,
                    },
                });
                return Array.isArray(data)
                    ? [...data, { ...payload, id }]
                    : { ...payload, id };
            },
            {
                // data to immediately update the client cache
                optimisticData: Array.isArray(data)
                    ? [...data, { ...payload }]
                    : { ...payload },
                rollbackOnError: true,
                ...mutatorOptions,
            }
        );
    };
};

export default usePost;
