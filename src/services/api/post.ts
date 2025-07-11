import Cookies from "js-cookie";
import { sessionCookie, sessionHeader, sessionPrefix } from "@/config/session";
import { logger } from "@/utils/logger";
import { errorNotification, successNotification } from "./utils";

const postFetch = async <T>(
    url: string,
    data: unknown,
    options: RequestOptions
): Promise<T | string | null> => {
    const { withPagination, notificationOptions } = options;
    const {
        successNotificationsOn = true,
        errorNotificationsOn = true,
        ...props
    } = notificationOptions;

    try {
        const isFormData = data instanceof FormData;
        const session = Cookies.get(sessionCookie)!;

        if (process.env.NEXT_PUBLIC_LOG_LEVEL === "debug") {
            const message = {
                url,
                data,
                options,
            };
            logger.info(message, session, "post");
        }
        const response = await fetch(url, {
            method: "POST",
            body: !isFormData ? JSON.stringify(data) : data,
            credentials: "include",
            headers: !isFormData
                ? {
                      "Content-Type": "application/json",
                      [sessionHeader]: sessionPrefix + session,
                  }
                : {},
        });

        if (response.ok) {
            if (successNotificationsOn) {
                successNotification({
                    method: "post",
                    props,
                });
            }

            const contentType = response.headers.get("content-type");

            if (contentType?.includes("text")) {
                const text = await response.text();
                return text;
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
            let errorMessage: string;
            let error;
            try {
                const errorData = await response.json();
                error = errorData;
                errorMessage = JSON.stringify(errorData, null, 2);
            } catch {
                errorMessage = await response.text();
            }
            logger.error(errorMessage, session, `post`);
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
