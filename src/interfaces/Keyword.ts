export interface Keyword {
    id: number;
    name: string;
    enabled: boolean;
    created_at?: string;
    updated_at?: string;
    pivot?: {
        collection_id?: number;
        keyword_id: number;
    }
}
