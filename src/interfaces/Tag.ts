interface Tag {
    created_at: Date;
    deleted_at: Date | null;
    description: string;
    enabled: boolean;
    id: number;
    type: "features" | "topics";
    updated_at: Date;
}

export type { Tag };
