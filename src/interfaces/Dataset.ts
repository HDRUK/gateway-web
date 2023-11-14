type DatasetStatus = "Archived" | "Active" | "Draft";

interface Dataset {
    id: number;
    status: DatasetStatus;
    label: string | null;
    pid: string | null;
    updated: string;
    version: string | null;
    create_origin: "FMA" | "MANUAL" | "API";
}

export type { Dataset, DatasetStatus };
