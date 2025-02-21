import { RequestOptions } from "@/interfaces/Api";
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

    try {
        const response = await fetch(url, {
            method: "DELETE",
            credentials: "include",
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
                props,
                method: "delete",
            });
        }
    }
    return null;
};

export default deleteRequest;
