import { RequestOptions } from "@/interfaces/Api";
import { errorNotification } from "./utils";

const patchRequest = async <T>(
    url: string,
    data: unknown,
    options: RequestOptions
): Promise<T | null> => {
    const { notificationOptions } = options;
    const { errorNotificationsOn = true, ...props } = notificationOptions || {};

    try {
        const response = await fetch(url, {
            method: "PATCH",
            body: JSON.stringify(data),
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (response.ok) {
            const json = await response.json();

            return json.data;
        }

        if (!response.ok) {
            const error = await response.json();
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
                error,
                props,
                method: "patch",
            });
        }
    }
    return null;
};

export default patchRequest;
