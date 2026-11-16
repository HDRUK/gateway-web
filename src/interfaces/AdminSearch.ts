interface AdminSearchEntityStatus {
    entity: string;
    model: string;
    collection: string;
    collectionExists: boolean;
    documentCount: number;
    databaseCount: number;
    eligibleCount: number;
    facetFields: string;
}

interface AdminSearchStatusResponse {
    entities: AdminSearchEntityStatus[];
}

export type { AdminSearchEntityStatus, AdminSearchStatusResponse };
