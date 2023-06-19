import { useSWRConfig } from "swr";
import apiService from "@/services/api";
import { useTranslation } from "next-i18next";
import { HttpOptions } from "@/interfaces/Api";
import {
    ThrowPaginationError,
    putMutateData,
    putOptimisticData,
} from "@/utils/api";
import useGet from "./useGet";

const usePut = <T extends { id?: number }>(
    url: string,
    options?: HttpOptions
) => {
    const { mutate } = useSWRConfig();
    const { data } = useGet(options?.paginationKey || url);
    const { t, i18n } = useTranslation("api");
    const { localeKey, itemName, action, ...mutatorOptions } = options || {};

    ThrowPaginationError(options);

    return (payload: T) => {
        mutate(
            options?.paginationKey || url,
            async () => {
                await apiService.putRequest(`${url}/${payload.id}`, payload, {
                    notificationOptions: {
                        localeKey,
                        itemName,
                        t,
                        i18n,
                        action,
                    },
                });
                return putMutateData({ options, data, payload });
            },
            {
                // data to immediately update the client cache
                optimisticData: putOptimisticData({ options, data, payload }),
                rollbackOnError: true,
                ...mutatorOptions,
            }
        );
    };
};

export default usePut;
