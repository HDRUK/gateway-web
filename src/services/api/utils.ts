import { NotificationOptions } from "@/interfaces/Api";
import { AxiosResponse } from "axios";
import { Error } from "@/interfaces/Error";
import notificationService from "@/services/notification";
import messages from "@/config/messages/en.json";
import { get } from "lodash";

interface ErrorNotificationProps {
    props: NotificationOptions;
    errorResponse: AxiosResponse<Error>;
    method: "delete" | "post" | "put" | "get" | "patch";
}

const errorNotification = ({
    errorResponse,
    method,
    props,
}: ErrorNotificationProps) => {
    const { t, ...notificationProps } = props;
    const { data, status } = errorResponse || {};

    const fallbackTitle = get(messages, `api.common.error.status.${status}`)
        ? t(`common.error.status.${status}`)
        : "There has been an error";

    const title = data?.title || fallbackTitle;
    const message =
        data?.message ||
        t(`common.error.${method}.message`, {
            item: props.itemName || "Item",
        });

    notificationService.apiError(message, {
        title,
        message,
        errors: data?.errors,
        ...notificationProps,
    });
};

interface SuccessNotificationProps {
    props: NotificationOptions;
    method: "delete" | "post" | "put" | "patch";
}

const successNotification = ({ props, method }: SuccessNotificationProps) => {
    const { t, ...notificationProps } = props;

    const message = get(
        messages,
        `api.${props.localeKey}.success.${method}.message`
    )
        ? t(`${props.localeKey}.success.${method}.message`)
        : t(`common.success.${method}.message`, {
              item: props.itemName || "Item",
          });

    notificationService.apiSuccess(message, { ...notificationProps });
};

export { errorNotification, successNotification };
