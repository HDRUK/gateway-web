import apiService from "@/services/api";
import { useTranslations } from "next-intl";
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
        successNotificationsOn = true,
        errorNotificationsOn = true,
    } = options || {};
    const t = useTranslations("api");

    ThrowPaginationError(options);

    return async (id: string | number, payload: T) => {
        return await apiService.putRequest(`${url}/${id}`, payload, {
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

export default usePut;
