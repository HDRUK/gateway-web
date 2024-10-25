import { Notification } from "@/interfaces/Notification";
import { Permission } from "@/interfaces/Permission";

interface Application {
    id: number;
    name: string;
    app_id: string;
    client_id: string;
    description: string;
    team_id: number;
    image_link?: string;
    user_id: number;
    enabled: boolean;
    created_at: string;
    updated_at: string;
    permissions: Permission[];
    notifications: Notification[] | undefined;
}

interface ApplicationPayload extends Omit<Application, "permissions"> {
    permissions: number[] | undefined;
}

interface ApplicationForm {
    id: number;
    description: string;
    notifications: number[] | undefined;
    name: string;
}

export type { Application, ApplicationPayload, ApplicationForm };
