import http from "@/utils/http";
import { RequestOptions } from "@/interfaces/Api";
import { errorNotification, successNotification } from "./utils";

const patchRequest = async <T>(
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
        .patch(url, data, axiosOptions)
        .then(res => {
            if (successNotificationsOn) {
                successNotification({
                    method: "patch",
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
                    method: "patch",
                });
            }
            throw error;
        });
};

export { patchRequest };
