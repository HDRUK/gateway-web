type DatasetStatus = "Archived" | "Active" | "Draft";

interface DatasetSchema {
    metadata: {
        summary: {
            title: string;
            publisher: {
                publisherName: string;
            };
        };
    };
}
interface Dataset {
    id: number;
    status: DatasetStatus;
    label: string | null;
    pid: string | null;
    dataset: string;
    updated: string;
    version: string | null;
    create_origin: "FMA" | "MANUAL" | "API";
}

export type { Dataset, DatasetStatus, DatasetSchema };
