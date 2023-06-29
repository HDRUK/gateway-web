import http from "@/utils/http";
import { RequestOptions } from "@/interfaces/Api";
import { errorNotification, successNotification } from "./utils";

const deleteRequest = async (url: string, options: RequestOptions) => {
    const { axiosOptions = {}, notificationOptions } = options;
    const {
        successNotificationsOn = true,
        errorNotificationsOn = true,
        ...props
    } = notificationOptions;

    return http
        .delete(url, axiosOptions)
        .then(res => {
            if (successNotificationsOn) {
                successNotification({
                    method: "delete",
                    props,
                });
            }
            return res.data;
        })
        .catch(error => {
            if (errorNotificationsOn) {
                errorNotification({
                    errorResponse: error.response,
                    props,
                    method: "delete",
                });
            }
        });
};

export { deleteRequest };
