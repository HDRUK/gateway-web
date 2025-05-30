interface Library {
    id: number;
    user_id: number;
    dataset_id: number;
    created_at: string;
    updated_at: string;
    dataset_name: string;
    data_provider_id: number;
    data_provider_dar_enabled: boolean;
    data_provider_name: string;
    data_provider_member_of: string;
    dataset_is_cohort_discovery: boolean;
}

interface SelectedLibrary {
    [id: string]: {
        selected: boolean;
        datasetId: number;
        name: string;
        teamId: number;
        teamName: string;
        teamMemberOf: string;
        darEnabled: boolean;
        cohortEnabled: boolean;
    };
}

interface LibraryListItem {
    id: number;
    datasetId: number;
    name: string;
    darEnabled: boolean;
    cohortEnabled: boolean;
    dataCustodian: string;
    entityType: string;
    dataCustodianId: number;
    dataCustodianMemberOf: string;
}

interface NewLibrary {
    user_id: number;
    dataset_id: number;
}

export type { Library, LibraryListItem, SelectedLibrary, NewLibrary };
