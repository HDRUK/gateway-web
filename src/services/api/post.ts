import http from "@/utils/http";
import { RequestOptions } from "@/interfaces/Api";
import { errorNotification, successNotification } from "./utils";

const postRequest = async <T>(
    url: string,
    data: unknown,
    options: RequestOptions
): Promise<T> => {
    const { axiosOptions = {}, notificationOptions } = options;
    const { notificationsOn = true, ...props } = notificationOptions;

    return await http
        .post(url, data, axiosOptions)
        .then(res => {
            if (notificationsOn) {
                successNotification({
                    method: "post",
                    props,
                });
            }
            return res.data?.data;
        })
        .catch(error => {
            if (notificationsOn) {
                errorNotification({
                    errorResponse: error.response,
                    props,
                    method: "post",
                });
            }
        });
};

export { postRequest };
