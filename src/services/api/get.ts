import { RequestOptions } from "@/interfaces/Api";
import http from "@/utils/http";
import { errorNotification } from "./utils";

const getRequest = async <T>(
    url: string,
    options: RequestOptions
): Promise<T> => {
    const { withPagination, axiosOptions = {}, notificationOptions } = options;
    const { errorNotificationsOn = true, ...props } = notificationOptions;

    return await http
        .get(url, axiosOptions)
        .then(res => {
            const contentType = res.headers["content-type"];
            if (contentType && contentType.includes("text/csv")) {
                const filename = "download.csv";
                return {
                    content: res.data,
                    type: "text/csv",
                    filename,
                };
            }

            if (!withPagination) return res.data?.data;

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
                    method: "get",
                });
            }
        });
};

export { getRequest };
