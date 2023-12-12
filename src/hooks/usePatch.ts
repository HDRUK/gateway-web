import apiService from "@/services/api";
import { useTranslations } from "next-intl";
import { HttpOptions } from "@/interfaces/Api";
import { ThrowPaginationError } from "@/utils/api";

const usePatch = <T extends { id?: number }>(
    url: string,
    options?: HttpOptions
) => {
    const {
        localeKey,
        itemName,
        action,
        query,
        successNotificationsOn = true,
        errorNotificationsOn = true,
    } = options || {};
    const t = useTranslations("api");

    ThrowPaginationError(options);

    return async (id: string | number | null, payload: T) => {
        // this really could be improved..
        // .. didnt want to mess up other usePatch() that pass ID though
        const queryString = query ? `?${query}` : "";
        const urlString = `${url}${id ? `/${id}` : ""}${queryString}`;
        return await apiService.patchRequest(urlString, payload, {
            notificationOptions: {
                localeKey,
                itemName,
                successNotificationsOn,
                errorNotificationsOn,
                t,
                action,
            },
        });
    };
};

export default usePatch;
