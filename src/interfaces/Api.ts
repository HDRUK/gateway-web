import { OptionsWithExtraProps, VariantType } from "notistack";
import { AxiosRequestConfig } from "axios";
import { I18n, TFunction } from "next-i18next";
import { ReactNode } from "react";
import { MutatorOptions } from "swr";

interface NotificationOptions extends OptionsWithExtraProps<VariantType> {
    successNotificationsOn?: boolean;
    errorNotificationsOn?: boolean;
    localeKey?: string;
    itemName?: string;
    t?: TFunction;
    i18n?: I18n;
    action?: ReactNode;
}

interface RequestOptions {
    withPagination?: boolean;
    axiosOptions?: AxiosRequestConfig;
    notificationOptions: NotificationOptions;
}

interface HttpOptions extends MutatorOptions {
    localeKey?: string;
    overideUrl?: boolean;
    shouldFetch?: boolean;
    successNotificationsOn?: boolean;
    errorNotificationsOn?: boolean;
    itemName?: string;
    query?: string;
    data?: unknown;
    paginationKey?: string;
    withPagination?: boolean;
    action?: ReactNode;
}

interface PaginationResponse {
    list: { id: string | number }[]; // renamed from BE prop `data`
    lastPage: number; // renamed from BE prop `last_page`
    nextPageUrl: string | null; // renamed from `next_page_url`

    // below props not currently used:
    current_page: string;
    first_page_url: string;
    from: number;
    last_page_url: string;
    links: {
        url: string;
        label: string;
        active: boolean;
    }[];
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
}

export type {
    NotificationOptions,
    RequestOptions,
    HttpOptions,
    PaginationResponse,
};
