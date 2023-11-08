type DatasetStatus = "Archived" | "Active" | "Draft";

interface Dataset {
    id: number;
    status: DatasetStatus;
}

export type { Dataset, DatasetStatus };
