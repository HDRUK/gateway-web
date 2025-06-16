import Cookies from "js-cookie";
import { sessionCookie, sessionHeader, sessionPrefix } from "@/config/session";
import { logger } from "@/utils/logger";
import { errorNotification, successNotification } from "./utils";

const patchRequest = async <T>(
    url: string,
    data: unknown,
    options: RequestOptions
): Promise<T | null> => {
    const { notificationOptions } = options;
    const {
        successNotificationsOn = true,
        errorNotificationsOn = true,
        ...props
    } = notificationOptions || {};
    const session = Cookies.get(sessionCookie)!;

    if (process.env.NEXT_PUBLIC_LOG_LEVEL === "debug") {
        const message = {
            url,
            data,
            options,
        };
        logger.info(message, session, "patch");
    }
    try {
        const response = await fetch(url, {
            method: "PATCH",
            body: JSON.stringify(data),
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                [sessionHeader]: sessionPrefix + session,
            },
        });

        if (response.ok) {
            const json = await response.json();

            if (successNotificationsOn) {
                successNotification({
                    method: "patch",
                    props,
                });
            }

            return json.data;
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
            logger.error(errorMessage, session, `patch`);
            if (errorNotificationsOn) {
                errorNotification({
                    status: response.status,
                    error: { ...error },
                    props,
                    method: "patch",
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
                method: "patch",
            });
        }
    }
    return null;
};

export default patchRequest;
