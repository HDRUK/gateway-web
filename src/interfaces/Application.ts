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
}

interface ApplicationPayload extends Omit<Application, "permissions"> {
    permissions: number[] | undefined;
}

export type { Application, ApplicationPayload };
