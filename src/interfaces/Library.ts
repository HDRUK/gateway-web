interface Library {
    id: number;
    user_id: number;
    dataset_id: number;
    created_at: string;
    updated_at: string;
    dataset_name: string;
    data_provider_dar_enabled: boolean;
    data_provider_name: string;
}

interface SelectedLibrary {
    [id: string]: { selected: boolean; datasetId: number };
}

interface LibraryListItem {
    id: number;
    datasetId: number;
    name: string;
    darEnabled: boolean;
    dataCustodian: string;
    entityType: string;
}

interface NewLibrary {
    user_id: number;
    dataset_id: number;
}

export type { Library, LibraryListItem, SelectedLibrary, NewLibrary };
