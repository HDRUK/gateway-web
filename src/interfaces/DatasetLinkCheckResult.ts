interface DatasetLinkCheckResult {
    teamId: number | null;
    teamName: string | null;
    datasetId: number;
    url: string;
    statusCode: number | null;
    checkedAt: string;
}

export type { DatasetLinkCheckResult };
