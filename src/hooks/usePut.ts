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

const usePut = <T extends { id?: number }>(key: string, options?: Options) => {
    const { mutate } = useSWRConfig();
    const { data } = useGet(key);
    const { t, i18n } = useTranslation("api");
    const { localeKey, itemName, action, ...mutatorOptions } = options || {};

    return (payload: T) => {
        mutate(
            key,
            async () => {
                await apiService.putRequest(`${key}/${payload.id}`, payload, {
                    notificationOptions: {
                        localeKey,
                        itemName,
                        t,
                        i18n,
                        action,
                    },
                });
                return Array.isArray(data)
                    ? data.map(item =>
                          item.id === payload.id ? payload : item
                      )
                    : payload;
            },
            {
                // data to immediately update the client cache
                optimisticData: Array.isArray(data)
                    ? data.map(item =>
                          item.id === payload.id ? payload : item
                      )
                    : payload,
                rollbackOnError: true,
                ...mutatorOptions,
            }
        );
    };
};

export default usePut;
