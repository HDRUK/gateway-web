import { RequestOptions } from "@/interfaces/Api";
import { errorNotification } from "./utils";

const CONTENT_TYPE_EXCEL =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
const CONTENT_TYPE_CSV = "text/csv";

const getRequest = async <T>(
    url: string,
    options: RequestOptions,
    noCors = false
): Promise<T | unknown> => {
    const { withPagination, notificationOptions } = options;
    const { errorNotificationsOn = true, ...props } = notificationOptions;

    try {
        const response = await fetch(url, { credentials: "include", ...(noCors) ? {mode: 'no-cors'} : {} });

        if (response.ok) {
            const contentType = response.headers.get("Content-Type");

            if (contentType && contentType.includes(CONTENT_TYPE_CSV)) {
                const text = await response.text();
                const disposition = response.headers.get("Content-Disposition");

                let filename = "download.csv";
                if (disposition) {
                    const match = disposition.match(/filename="(.*?)"/);
                    if (match && match[1]) {
                        [, filename] = match;
                    }
                }
                return {
                    content: text,
                    type: CONTENT_TYPE_CSV,
                    filename,
                };
            }
            if (contentType && contentType.includes(CONTENT_TYPE_EXCEL)) {
                const filename = "download.xlsx";
                const content = await response.blob();

                return {
                    content,
                    type: CONTENT_TYPE_EXCEL,
                    filename,
                };
            }

            const json = await response.json();

            if (!withPagination) return json.data;

            const { data, current_page, last_page, next_page_url, ...rest } =
                json;

            return {
                list: data,
                currentPage: current_page,
                lastPage: last_page,
                nextPageUrl: next_page_url,
                ...rest,
            };
        }

        if (!response.ok) {
            const error = await response.json();
            if (errorNotificationsOn) {
                errorNotification({
                    status: response.status,
                    error: { ...error },
                    props,
                    method: "get",
                });
            }
        }
    } catch (error) {
        if (process.env.NODE_ENV === "development") {
            console.error(error);
        }

        if (errorNotificationsOn) {
            errorNotification({
                props,
                method: "get",
            });
        }
    }
    return null;
};

export default getRequest;
