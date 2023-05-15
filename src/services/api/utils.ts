import { NotificationOptions } from "@/interfaces/Api";
import { AxiosResponse } from "axios";
import { Error } from "@/interfaces/Error";
import notificationService from "../notification";

interface ErrorNotificationProps {
    props: NotificationOptions;
    errorResponse: AxiosResponse<Error>;
    method: "delete" | "post" | "put" | "get";
}

const errorNotification = ({
    errorResponse,
    method,
    props,
}: ErrorNotificationProps) => {
    const { t, i18n, ...notificationProps } = props;
    const { data, status } = errorResponse || {};

    const fallbackTitle = i18n.exists(`api:common.error.status.${status}`)
        ? t(`api:common.error.status.${status}`)
        : "There has been an error";

    const title = data?.title || fallbackTitle;
    const message =
        data?.message ||
        t(`api:common.error.${method}.message`, {
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
    method: "delete" | "post" | "put";
}

const successNotification = ({ props, method }: SuccessNotificationProps) => {
    const { t, i18n, ...notificationProps } = props;
    const customMessage = `api:${props.localeKey}.success.${method}.message`;
    const shouldOverideMessage = i18n.exists(customMessage);

    const message = shouldOverideMessage
        ? t(customMessage)
        : t(`api:common.success.${method}.message`, {
              item: props.itemName || "Item",
          });

    notificationService.success(message, { ...notificationProps });
};

export { errorNotification, successNotification };
