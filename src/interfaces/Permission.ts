interface Permission {
    allowed_from_apps: number;
    description: number | null;
    id: number;
    name: string;
    pivot: { role_id: number; permission_id: number };
    permission_id: number;
    role_id: number;
}

export type { Permission };
