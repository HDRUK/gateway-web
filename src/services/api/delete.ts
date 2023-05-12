import http from "@/utils/http";
import { RequestOptions } from "@/interfaces/Api";
import { errorNotification, successNotification } from "./utils";

const deleteRequest = async (url: string, options: RequestOptions) => {
    const { axiosOptions = {}, notificationOptions } = options;
    const { notificationsOn = true, ...props } = notificationOptions;

    return http
        .delete(url, axiosOptions)
        .then(res => {
            if (notificationsOn) {
                successNotification({
                    method: "delete",
                    props,
                });
            }
            return res.data;
        })
        .catch(error => {
            if (notificationsOn) {
                errorNotification({
                    errorResponse: error.response,
                    props,
                    method: "delete",
                });
            }
        });
};

export { deleteRequest };
