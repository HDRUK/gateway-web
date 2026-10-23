import {
    SearchAggregationData,
    SearchCategory,
    SearchResultDataset,
} from "@/interfaces/Search";
import { datasetSearchResultV1 } from "@/mocks/data/dataset/v1/dataset.data";

const generateDatasetHits = (count: number) =>
    Array.from({ length: count }).map((_, index) => ({
        ...datasetSearchResultV1,
        _id: `${index + 1}`,
    })) as SearchResultDataset[];

const generateSearchV2Response = (
    type: SearchCategory,
    hits = type === SearchCategory.DATASETS ? generateDatasetHits(2) : [],
    total = hits.length
): SearchAggregationData => ({
    query: "",
    type,
    results: {
        HDRUK: {
            provider_logo: null,
            about: null,
            hits,
            total,
            aggregations: [],
            ids: hits.map(hit => hit._id),
        },
    },
});

export { generateSearchV2Response };
