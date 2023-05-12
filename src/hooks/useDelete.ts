import { MutatorOptions, useSWRConfig } from "swr";
import apiService from "@/services/api";
import { useTranslation } from "next-i18next";
import { ReactNode } from "react";
import useGet from "./useGet";

interface Options extends MutatorOptions {
    localeKey?: string;
    itemName?: string;
    actions?: ReactNode;
}

const useDelete = (key: string, options?: Options) => {
    const { mutate } = useSWRConfig();
    const { data } = useGet(key);
    const { t, i18n } = useTranslation("api");
    const { localeKey, itemName, actions, ...mutatorOptions } = options || {};

    return (id: number) => {
        mutate(
            key,
            async () => {
                await apiService.deleteRequest(`${key}/${id}`, {
                    notificationOptions: {
                        localeKey,
                        itemName,
                        t,
                        i18n,
                        actions,
                    },
                });
                return Array.isArray(data)
                    ? data.filter(item => item.id !== id)
                    : {};
            },
            {
                // data to immediately update the client cache
                optimisticData: Array.isArray(data)
                    ? data.filter(item => item.id !== id)
                    : {},
                rollbackOnError: true,
                ...mutatorOptions,
            }
        );
    };
};

export default useDelete;
