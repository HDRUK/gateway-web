import apiService from "@/services/api";
import { useTranslation } from "next-i18next";
import { HttpOptions } from "@/interfaces/Api";
import { ThrowPaginationError } from "@/utils/api";

const usePost = <T>(url: string, options?: HttpOptions) => {
    const { t, i18n } = useTranslation("api");
    const {
        localeKey,
        itemName,
        action,
        successNotificationsOn = true,
        errorNotificationsOn = true,
    } = options || {};

    ThrowPaginationError(options);

    return async (payload: Omit<T, "id">) => {
        return await apiService.postRequest<T>(url, payload, {
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

export default usePost;
