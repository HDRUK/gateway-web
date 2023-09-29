import apiService from "@/services/api";
import { useTranslation } from "next-i18next";
import { HttpOptions } from "@/interfaces/Api";
import { ThrowPaginationError } from "@/utils/api";

const usePut = <T extends { id?: number }>(
    url: string,
    options?: HttpOptions
) => {
    const {
        localeKey,
        itemName,
        action,
        successNotificationsOn,
        errorNotificationsOn,
    } = options || {};
    const { t, i18n } = useTranslation("api");

    ThrowPaginationError(options);

    return async (id: string | number, payload: T) => {
        return await apiService.putRequest(`${url}/${id}`, payload, {
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

export default usePut;
