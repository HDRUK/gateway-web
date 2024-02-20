import { RequestOptions } from "@/interfaces/Api";
import { errorNotification } from "./utils";

const deleteRequest = async <T>(
    url: string,
    options: RequestOptions
): Promise<T | null> => {
    const { notificationOptions } = options;
    const { errorNotificationsOn = true, ...props } = notificationOptions;

    try {
        const response = await fetch(url, {
            method: "DELETE",
            credentials: "include",
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
                error,
                props,
                method: "delete",
            });
        }
    }
    return null;
};

export default deleteRequest;
