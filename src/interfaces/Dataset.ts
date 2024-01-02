type DatasetStatus = "ARCHIVED" | "ACTIVE" | "DRAFT";

interface Metadata {
    [key: string]: { [key: string]: unknown }
}
interface VersionItem {
    id: number,
    created_at: string,
    updated_at: string,
    deleted_at: string | null,
    dataset_id: number,
    metadata: { metadata: Metadata },
    version: number,
}

interface Dataset {
    id: number;
    status: DatasetStatus;
    label: string | null;
    pid: string | null;
    versions: VersionItem[];
    updated: string;
    create_origin: "FMA" | "MANUAL" | "API";
}

export type { Dataset, DatasetStatus, VersionItem, Metadata };
