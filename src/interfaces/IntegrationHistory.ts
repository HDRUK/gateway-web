interface FailedDataset {
    pid: string;
    message: string;
}

interface IntegrationHistory {
    job_uuid: string;
    started_at: string;
    finished_at: string;
    status: "success" | "failed";
    message: string | null;
    failed_datasets: FailedDataset[];
}

export type { IntegrationHistory, FailedDataset };
