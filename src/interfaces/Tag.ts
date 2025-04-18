export type TagTypes = "features" | "topics";

interface Tag {
    created_at: string;
    deleted_at: string | null;
    description: string;
    enabled: boolean;
    id: number;
    type: TagTypes;
    updated_at: string;
    pivot?: {
        tool_id: number;
        tag_id: number;
    };
}

export type { Tag };
