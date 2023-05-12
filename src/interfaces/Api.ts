import { OptionsWithExtraProps, VariantType } from "notistack";
import { AxiosRequestConfig } from "axios";
import { I18n, TFunction } from "next-i18next";
import { ReactNode } from "react";

interface NotificationOptions extends OptionsWithExtraProps<VariantType> {
    notificationsOn?: boolean;
    localeKey?: string;
    itemName?: string;
    t: TFunction;
    i18n: I18n;
    actions?: ReactNode;
}

interface RequestOptions {
    axiosOptions?: AxiosRequestConfig;
    notificationOptions: NotificationOptions;
}

export type { NotificationOptions, RequestOptions };
