import Cookies from "js-cookie";
import { sessionCookie, sessionHeader, sessionPrefix } from "@/config/session";
import { logger } from "@/utils/logger";
import { errorNotification, successNotification } from "./utils";

const deleteRequest = async <T>(
    url: string,
    options: RequestOptions
): Promise<T | null> => {
    const { notificationOptions } = options;
    const {
        successNotificationsOn = true,
        errorNotificationsOn = true,
        ...props
    } = notificationOptions;
    const session = Cookies.get(sessionCookie)!;
    if (process.env.NEXT_PUBLIC_LOG_LEVEL === "debug") {
        const message = {
            url,
            options,
        };
        logger.info(message, session, "delete");
    }

    try {
        const response = await fetch(url, {
            method: "DELETE",
            credentials: "include",
            headers: { [sessionHeader]: sessionPrefix + session },
        });

        if (response.ok) {
            const json = await response.json();

            if (successNotificationsOn) {
                successNotification({
                    method: "delete",
                    props,
                });
            }

            return json.message;
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
            logger.error(errorMessage, session, `delete`);
            if (errorNotificationsOn) {
                errorNotification({
                    status: response.status,
                    error: { ...error },
                    props,
                    method: "delete",
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
                method: "delete",
            });
        }
    }
    return null;
};

export default deleteRequest;
