import { Tag } from "./Tag";

interface Application {
    id: number;
    name?: string;
    app_id?: string;
    client_id?: string;
    image_link?: string;
    description?: string;
    team_id?: number;
    user_id?: number;
    enabled: boolean;
    created_at?: string;
    updated_at?: string;
    tags?: Tag[];
}

export type { Application };
