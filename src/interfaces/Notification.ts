interface Notification {
    id?: number;
    opt_in?: number;
    message?: string;
    email: string;
    enabled?: boolean;
    notification_type?: string;
}

export type { Notification };
