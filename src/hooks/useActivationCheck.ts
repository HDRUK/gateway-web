import { useTranslations } from "next-intl";
import apiService from "@/services/api";
import notificationService from "@/services/notification";
import { ActivationTarget, FetchData } from "@/utils/activation";

interface ActivationCheck {
    load: (fetchData: FetchData) => Promise<ActivationTarget | null>;
}

const useActivationCheck = () => {
    const t = useTranslations("hooks.UseActivationCheck");
    const tApi = useTranslations("api");

    const fetchData: FetchData = async <T>(url: string) =>
        (await apiService.getRequest<T>(url, {
            notificationOptions: { t: tApi },
        })) as T | null;

    return async ({ load }: ActivationCheck) => {
        const target = await load(fetchData);

        if (!target) {
            return false;
        }

        if (await target.schema.isValid(target.values)) {
            return true;
        }

        notificationService.apiError(t("message"), { title: t("title") });

        return false;
    };
};

export default useActivationCheck;
