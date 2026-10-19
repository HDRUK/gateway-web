import { useTranslations } from "next-intl";
import apiService from "@/services/api";
import notificationService from "@/services/notification";
import {
    ActivationTarget,
    FetchData,
    getActivationErrors,
} from "@/utils/activation";

interface ActivationCheck {
    load: (fetchData: FetchData) => Promise<ActivationTarget | null>;
    labels?: Record<string, string>;
}

const useActivationCheck = () => {
    const t = useTranslations("hooks.UseActivationCheck");
    const tApi = useTranslations("api");

    const fetchData: FetchData = async <T>(url: string) =>
        (await apiService.getRequest<T>(url, {
            notificationOptions: { t: tApi },
        })) as T | null;

    return async ({ load, labels }: ActivationCheck) => {
        const target = await load(fetchData);

        if (!target) {
            return false;
        }

        const errors = await getActivationErrors(
            target.schema,
            target.values,
            labels
        );

        if (!errors.length) {
            return true;
        }

        notificationService.apiError(t("message"), {
            title: t("title"),
            errors: errors.map(message => ({ message })),
        });

        return false;
    };
};

export default useActivationCheck;
