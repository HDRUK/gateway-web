import http from "@/utils/http";
import { RequestOptions } from "@/interfaces/Api";
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
                //const blob = new Blob([res.data], { type: "text/csv" });

                const contentDisposition = res.headers["content-disposition"];
                let filename = "Cohort_Discovery_Admin.csv"; // Default filename if not found
                if (contentDisposition) {
                    const match = contentDisposition.match(/filename="(.*?)"/);
                    if (match && match[1]) {
                        filename = match[1];
                    }
                }

                // Create a temporary anchor element
                //const link = document.createElement("a");
                //link.href = window.URL.createObjectURL(blob);
                //link.download = filename;

                return {
                    content: res.data,
                    type: "text/csv",
                    filename: filename,
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
