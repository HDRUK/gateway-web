import http from "@/utils/http";
import { RequestOptions } from "@/interfaces/Api";
import { errorNotification } from "./utils";

const getRequest = async <T>(
    url: string,
    options: RequestOptions
): Promise<T> => {
    const { withPagination, axiosOptions = {}, notificationOptions } = options;
    const { notificationsOn = true, ...props } = notificationOptions;

    return await http
        .get(url, axiosOptions)
        .then(res => {
            if (!withPagination) return res.data?.data;

            const {
                data: list,
                last_page: pageCount,
                ...rest
            } = res.data || {};
            return {
                list,
                pageCount,
                ...rest,
            };
        })
        .catch(error => {
            if (notificationsOn) {
                errorNotification({
                    errorResponse: error.response,
                    props,
                    method: "get",
                });
            }
        });
};

export { getRequest };
