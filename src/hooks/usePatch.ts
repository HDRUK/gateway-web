import apiService from "@/services/api";
import { useTranslation } from "next-i18next";
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
        successNotificationsOn = true,
        errorNotificationsOn = true,
    } = options || {};
    const { t, i18n } = useTranslation("api");

    ThrowPaginationError(options);

    return async (id: string | number, payload: T) => {
        return await apiService.patchRequest(`${url}/${id}`, payload, {
            notificationOptions: {
                localeKey,
                itemName,
                successNotificationsOn,
                errorNotificationsOn,
                t,
                i18n,
                action,
            },
        });
    };
};

export default usePatch;
