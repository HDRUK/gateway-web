interface Notification {
    id: number;
    opt_in: number;
    message: string;
    email: string;
    enabled: boolean;
    notification_type: string;
    user_id?: number;
}

export type { Notification };
