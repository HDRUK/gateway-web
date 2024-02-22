import { RequestOptions } from "@/interfaces/Api";
import { errorNotification, successNotification } from "./utils";

const postFetch = async <T>(
    url: string,
    data: unknown,
    options: RequestOptions
): Promise<T | null> => {
    const { withPagination, notificationOptions } = options;
    const {
        successNotificationsOn = true,
        errorNotificationsOn = true,
        ...props
    } = notificationOptions;

    try {
        const response = await fetch(url, {
            method: "POST",
            body: JSON.stringify(data),
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (response.ok) {
            const json = await response.json();

            if (successNotificationsOn) {
                successNotification({
                    method: "post",
                    props,
                });
            }

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
                    method: "post",
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
                method: "post",
            });
        }
    }
    return null;
};

export default postFetch;
