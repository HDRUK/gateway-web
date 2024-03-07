import { useTranslations } from "next-intl";
import { HttpOptions } from "@/interfaces/Api";
import apiService from "@/services/api";

const usePut = <T>(url: string, options?: HttpOptions) => {
    const {
        localeKey,
        itemName,
        action,
        successNotificationsOn = true,
        errorNotificationsOn = true,
    } = options || {};
    const t = useTranslations("api");

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
