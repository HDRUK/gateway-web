import apiService from "@/services/api";
import { useTranslations } from "next-intl";
import { ThrowPaginationError } from "@/utils/api";
import { HttpOptions } from "@/interfaces/Api";

const useDelete = (url: string, options?: HttpOptions) => {
    const t = useTranslations("api");
    const { localeKey, itemName, action } = options || {};

    ThrowPaginationError(options);

    return (id: number | string) => {
        return apiService.deleteRequest(`${url}/${id}`, {
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
