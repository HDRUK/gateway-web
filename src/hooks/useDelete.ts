import apiService from "@/services/api";
import { useTranslation } from "next-i18next";
import { ThrowPaginationError } from "@/utils/api";
import { HttpOptions } from "@/interfaces/Api";

const useDelete = (url: string, options?: HttpOptions) => {
    const { t, i18n } = useTranslation("api");
    const { localeKey, itemName, action } = options || {};

    ThrowPaginationError(options);

    return (id: number | string) => {
        return apiService.deleteRequest(`${url}/${id}`, {
            notificationOptions: {
                localeKey,
                itemName,
                t,
                i18n,
                action,
            },
        });
    };
};

export default useDelete;
