import apiService from "@/services/api";
import { useTranslation } from "next-i18next";
import config from "@/config";

const useLogout = () => {
    const { t, i18n } = useTranslation("api");

    return () => {
        apiService.postRequest(config.logoutV1Url, null, {
            notificationOptions: {
                notificationsOn: false,
                t,
                i18n,
            },
        });
    };
};

export default useLogout;
