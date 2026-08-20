interface NightlyDatasetTestSummary {
    totalChecked: number;
    totalSuccessful: number;
    totalFailed: number;
    percentageFailed: number;
}

interface FailedDatasetTest {
    datasetId: number;
    statusCode: number | null;
    checkedAt: string;
}

interface NightlyDatasetTestResponse {
    summary: NightlyDatasetTestSummary;
    failedDatasets: FailedDatasetTest[];
}

export type {
    NightlyDatasetTestSummary,
    FailedDatasetTest,
    NightlyDatasetTestResponse,
};
