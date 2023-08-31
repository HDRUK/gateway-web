import { useSWRConfig } from "swr";
import apiService from "@/services/api";
import { useTranslation } from "next-i18next";
import {
    ThrowPaginationError,
    deleteMutateData,
    deleteOptimisticData,
} from "@/utils/api";
import { HttpOptions } from "@/interfaces/Api";
import useGet from "./useGet";

const useDelete = (url: string, options?: HttpOptions) => {
    const { mutate } = useSWRConfig();
    const { t, i18n } = useTranslation("api");
    const {
        localeKey,
        itemName,
        action,
        overideUrl = false,
        ...mutatorOptions
    } = options || {};

    const { data } = useGet(options?.paginationKey || url, {
        shouldFetch: !!overideUrl,
    });

    ThrowPaginationError(options);

    return (id: number) => {
        const urlTemp = overideUrl ? url : `${url}/${id}`;
        mutate(
            options?.paginationKey || url,
            async () => {
                await apiService.deleteRequest(urlTemp, {
                    notificationOptions: {
                        localeKey,
                        itemName,
                        t,
                        i18n,
                        action,
                    },
                });
                return deleteMutateData({ options, data, id });
            },
            {
                // data to immediately update the client cache
                optimisticData: deleteOptimisticData({ options, data, id }),
                rollbackOnError: true,
                ...mutatorOptions,
            }
        );
    };
};

export default useDelete;
