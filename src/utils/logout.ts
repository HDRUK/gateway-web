import apiService from "@/services/api";
import vars from "@/config/vars";

const logout = () => {
    apiService.postRequest(vars.logoutV1Url, null, {
        notificationOptions: {
            notificationsOn: false,
        },
    });
};

export default logout;
