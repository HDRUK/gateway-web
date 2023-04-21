interface Tag {
    created_at: string;
    deleted_at: string | null;
    description: string;
    enabled: boolean;
    id: number;
    type: "features" | "topics";
    updated_at: string;
}

export type { Tag };
