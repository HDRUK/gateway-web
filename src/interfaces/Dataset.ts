type DatasetStatus = "ARCHIVED" | "ACTIVE" | "DRAFT";

interface MauroItem {
    id: string;
    key: string;
    lastUpdated: string;
    namespace: string;
    value: string;
}

interface Dataset {
    id: number;
    status: DatasetStatus;
    label: string | null;
    pid: string | null;
    mauro: MauroItem[];
    updated: string;
    version: string | null;
    create_origin: "FMA" | "MANUAL" | "API";
}

export type { Dataset, DatasetStatus, MauroItem };
