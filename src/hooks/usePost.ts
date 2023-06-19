import { useSWRConfig } from "swr";
import apiService from "@/services/api";
import { useTranslation } from "next-i18next";
import { HttpOptions } from "@/interfaces/Api";
import {
    ThrowPaginationError,
    postMutateData,
    postOptimisticData,
} from "@/utils/api";
import useGet from "./useGet";

const usePost = <T>(url: string, options?: HttpOptions) => {
    const { mutate } = useSWRConfig();
    const { data } = useGet(options?.paginationKey || url);
    const { t, i18n } = useTranslation("api");
    const { localeKey, itemName, action, ...mutatorOptions } = options || {};

    ThrowPaginationError(options);

    return (payload: Omit<T, "id">) => {
        mutate(
            options?.paginationKey || url,
            async () => {
                const id: string | number = await apiService.postRequest(
                    url,
                    payload,
                    {
                        notificationOptions: {
                            localeKey,
                            itemName,
                            t,
                            i18n,
                            action,
                        },
                    }
                );
                return postMutateData({ options, data, payload, id });
            },
            {
                // data to immediately update the client cache
                optimisticData: postOptimisticData({ options, data, payload }),
                rollbackOnError: true,
                ...mutatorOptions,
            }
        );
    };
};

export default usePost;
