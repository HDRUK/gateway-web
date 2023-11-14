import { Dataset, DatasetStatus } from "@/interfaces/Dataset";

const getTabLength = (
    datasets: Dataset[] | undefined,
    status: DatasetStatus
) => {
    if (!datasets || !Array.isArray(datasets)) return 0;
    return datasets.filter(dataset => dataset.status === status).length;
};

export { getTabLength };
