import {
    PartnerPortalsResult,
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

const generatePartnerPortalsResult = (): PartnerPortalsResult => ({
    total: 1,
    portals: [
        {
            name: "Example Partner Portal",
            logo: "https://partner.example.com/logo.svg",
            search_url: "https://partner.example.com/search?q=asthma",
            total: 1,
            hits: [
                {
                    id: "123",
                    title: "Partner Dataset",
                    description: "A partner dataset description",
                    organisation: "Example University",
                    url: "https://partner.example.com/view/123",
                },
            ],
        },
    ],
});

export { generatePartnerPortalsResult, generateSearchV2Response };
