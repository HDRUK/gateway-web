type DatasetStatus = "ARCHIVED" | "ACTIVE" | "DRAFT";

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
    dataset: DatasetSchema;
    updated: string;
    version: string | null;
    create_origin: "FMA" | "MANUAL" | "API";
}

export type { Dataset, DatasetStatus, DatasetSchema };
