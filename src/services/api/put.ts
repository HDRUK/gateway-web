import http from "@/utils/http";
import { RequestOptions } from "@/interfaces/Api";
import { errorNotification, successNotification } from "./utils";

const putRequest = async <T>(
    url: string,
    data: unknown,
    options: RequestOptions
): Promise<T> => {
    const { axiosOptions = {}, notificationOptions } = options;
    const {
        successNotificationsOn = true,
        errorNotificationsOn = true,
        ...props
    } = notificationOptions;

    return await http
        .put(url, data, axiosOptions)
        .then(res => {
            if (successNotificationsOn) {
                successNotification({
                    method: "put",
                    props,
                });
            }
            return res.data?.data;
        })
        .catch(error => {
            if (errorNotificationsOn) {
                errorNotification({
                    errorResponse: error.response,
                    props,
                    method: "put",
                });
            }
        });
};

export { putRequest };
