import apiService from "@/services/api";
import { useTranslations } from "next-intl";
import { HttpOptions } from "@/interfaces/Api";
import { ThrowPaginationError } from "@/utils/api";

const usePost = <T>(url: string, options?: HttpOptions) => {
    const t = useTranslations("api");
    const {
        localeKey,
        itemName,
        action,
        successNotificationsOn = true,
        errorNotificationsOn = true,
    } = options || {};

    ThrowPaginationError(options);

    return async (payload: T) => {
        return await apiService.postRequest<T>(url, payload, {
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

export default usePost;
