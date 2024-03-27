import { useTranslations } from "next-intl";
import { HttpOptions } from "@/interfaces/Api";
import apiService from "@/services/api";

const usePatch = <T>(url: string, options?: HttpOptions) => {
    const {
        localeKey,
        itemName,
        action,
        query,
        successNotificationsOn = true,
        errorNotificationsOn = true,
    } = options || {};
    const t = useTranslations("api");

    return async (id: string | number, payload: T) => {
        const queryString = query ? `?${query}` : "";
        return await apiService.patchRequest(
            `${url}/${id}${queryString}`,
            payload,
            {
                notificationOptions: {
                    localeKey,
                    itemName,
                    successNotificationsOn,
                    errorNotificationsOn,
                    t,
                    action,
                },
            }
        );
    };
};

export default usePatch;
