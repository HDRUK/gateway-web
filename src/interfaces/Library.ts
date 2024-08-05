interface Library {
    id: number;
    user_id: number;
    dataset_id: number;
    created_at: string;
    updated_at: string;
}

interface NewLibrary {
    user_id: number;
    dataset_id: number;
}

export type { Library, NewLibrary };
