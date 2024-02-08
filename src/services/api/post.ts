import { RequestOptions } from "@/interfaces/Api";
import http from "@/utils/http";
import { errorNotification, successNotification } from "./utils";

const postRequest = async <T>(
    url: string,
    data: unknown,
    options: RequestOptions
): Promise<T> => {
    const { withPagination, axiosOptions = {}, notificationOptions } = options;
    const {
        successNotificationsOn = true,
        errorNotificationsOn = true,
        ...props
    } = notificationOptions;

    return await http
        .post(url, data, axiosOptions)
        .then(res => {
            if (successNotificationsOn) {
                successNotification({
                    method: "post",
                    props,
                });
            }
            if (!withPagination) return res.data?.data || res.data || res;

            const {
                data: list,
                current_page: currentPage,
                last_page: lastPage,
                next_page_url: nextPageUrl,
                ...rest
            } = res.data || {};
            return {
                list,
                currentPage,
                lastPage,
                nextPageUrl,
                ...rest,
            };
        })
        .catch(error => {
            if (errorNotificationsOn) {
                errorNotification({
                    errorResponse: error.response,
                    props,
                    method: "post",
                });
            }
            throw error;
        });
};

export { postRequest };
