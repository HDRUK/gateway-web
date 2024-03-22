import { ReactNode } from "react";
import { MutatorOptions } from "swr";

interface NotificationOptions {
    successNotificationsOn?: boolean;
    errorNotificationsOn?: boolean;
    localeKey?: string;
    itemName?: string;
    t: (key: string, options?: { [key: string]: string }) => string;
    action?: ReactNode;
}

interface RequestOptions {
    withPagination?: boolean;
    notificationOptions: NotificationOptions;
}

interface HttpOptions extends MutatorOptions {
    localeKey?: string;
    shouldFetch?: boolean;
    successNotificationsOn?: boolean;
    errorNotificationsOn?: boolean;
    itemName?: string;
    query?: string;
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
    RequestOptions,
    NotificationOptions,
    HttpOptions,
    PaginationResponse,
};
