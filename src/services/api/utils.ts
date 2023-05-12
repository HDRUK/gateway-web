import { NotificationOptions } from "@/interfaces/Api";
import { AxiosResponse } from "axios";
import { Error } from "@/interfaces/Error";
import notificationService from "../notification";

interface ErrorNotificationProps {
    props: NotificationOptions;
    errorResponse: AxiosResponse<Error>;
}

const errorNotification = ({
    errorResponse,
    props,
}: ErrorNotificationProps) => {
    const { t, ...notificationProps } = props;
    const { data } = errorResponse || {};

    const title = t(`common.error.${errorResponse?.status}.title`);
    const message =
        data?.message || t(`common.error.${errorResponse?.status}.message`);

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
