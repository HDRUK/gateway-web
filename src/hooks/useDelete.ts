import { useTranslations } from "next-intl";
import { HttpOptions } from "@/interfaces/Api";
import apiService from "@/services/api";

const useDelete = (url: string, options?: HttpOptions) => {
    const t = useTranslations("api");
    const { localeKey, itemName, action } = options || {};

    return async (id: number | string) => {
        return await apiService.deleteRequest(`${url}/${id}`, {
            notificationOptions: {
                localeKey,
                itemName,
                t,
                action,
            },
        });
    };
};

export default useDelete;
