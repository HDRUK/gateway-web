interface Role {
    created_at: string;
    enabled: boolean;
    id: number;
    name: string;
    pivot: { team_has_user_id: number; role_id: number };
    role_id: number;
    team_has_user_id: boolean;
    updated_at: string;
}

export type { Role };
