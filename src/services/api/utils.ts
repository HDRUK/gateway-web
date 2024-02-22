import { get } from "lodash";
import { NotificationOptions } from "@/interfaces/Api";
import { Error } from "@/interfaces/Error";
import notificationService from "@/services/notification";
import messages from "@/config/messages/en.json";

interface ErrorNotificationProps {
    props: NotificationOptions;
    status?: number;
    error?: Error;
    method: "delete" | "post" | "put" | "get" | "patch";
}

const errorNotification = ({
    error,
    method,
    status,
    props,
}: ErrorNotificationProps) => {
    const { t, ...notificationProps } = props;
    const { errors, message } = error || {};

    const title = get(messages, `api.common.error.status.${status}`)
        ? t(`common.error.status.${status}`)
        : "There has been an error";

    const messageTransformed =
        message ||
        t(`common.error.${method}.message`, {
            item: props.itemName || "item",
        });

    notificationService.apiError(messageTransformed, {
        title,
        errors,
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
              item: props.itemName || "item",
          });

    notificationService.apiSuccess(message, { ...notificationProps });
};

export { errorNotification, successNotification };
