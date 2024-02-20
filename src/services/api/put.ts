import { RequestOptions } from "@/interfaces/Api";
import { errorNotification } from "./utils";

const putRequest = async <T>(
    url: string,
    data: unknown,
    options: RequestOptions
): Promise<T | null> => {
    const { notificationOptions } = options;
    const { errorNotificationsOn = true, ...props } = notificationOptions || {};

    try {
        const response = await fetch(url, {
            method: "PUT",
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
                    method: "put",
                });
            }
        }
    } catch (error) {
        console.log("error: ", error);
        if (process.env.NODE_ENV === "development") {
            console.error(error);
        }

        if (errorNotificationsOn) {
            errorNotification({
                error,
                props,
                method: "put",
            });
        }
    }
    return null;
};

export default putRequest;
