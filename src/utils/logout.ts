import apiService from "@/services/api";
import config from "@/config";

const logout = () => {
    apiService.postRequest(config.logoutV1Url, null, {
        notificationOptions: {
            notificationsOn: false,
        },
    });
};

export default logout;
