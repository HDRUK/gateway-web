import {
    SearchAggregationData,
    SearchAggregationProviderResult,
    SearchCategory,
    SearchResult,
    SearchResultARDC,
} from "@/interfaces/Search";
import { datasetSearchResultV1 } from "@/mocks/data/dataset/v1/dataset.data";

interface SearchV1Response {
    data: SearchResult[];
    current_page: number;
    last_page: number;
    total: number;
    from: number;
    to: number;
    elastic_total: number;
    path: string;
    aggregations: Record<string, unknown>;
}

const generateDatasetSearchResults = (count: number, startId = 1) =>
    Array.from({ length: count }).map((_, index) => ({
        ...datasetSearchResultV1,
        _id: `${startId + index}`,
    }));

const generateNamedSearchResults = (count: number, prefix: string) =>
    Array.from({ length: count }).map((_, index) => ({
        _id: `${index + 1}`,
        id: index + 1,
        name: `${prefix} ${index + 1}`,
        description: `${prefix} description ${index + 1}`,
        created_at: "2024-01-01T00:00:00.000000Z",
        team: null,
    })) as unknown as SearchResult[];

const generatePublicationSearchResults = (count: number) =>
    Array.from({ length: count }).map((_, index) => ({
        _id: `${index + 1}`,
        paper_title: `Publication ${index + 1}`,
        authors: "A. Author",
        journal_name: "Journal",
        year_of_publication: "2024",
        full_text_url: "",
        url: "",
    })) as unknown as SearchResult[];

const generateDataUseSearchResults = (count: number) =>
    Array.from({ length: count }).map((_, index) => ({
        _id: `${index + 1}`,
        projectTitle: `Data use ${index + 1}`,
        organisationName: "Organisation",
        publisher: "Publisher",
        datasetTitles: [],
        datasetIds: [],
        highlight: { abstract: "", description: "" },
        team: { id: 1, member_of: "", name: "Team" },
    })) as unknown as SearchResult[];

const generateResultsForType = (type: SearchCategory, count: number) => {
    switch (type) {
        case SearchCategory.DATASETS:
            return generateDatasetSearchResults(count) as SearchResult[];
        case SearchCategory.PUBLICATIONS:
            return generatePublicationSearchResults(count);
        case SearchCategory.DATA_USE:
            return generateDataUseSearchResults(count);
        case SearchCategory.TOOLS:
            return generateNamedSearchResults(count, "Tool");
        case SearchCategory.COLLECTIONS:
            return generateNamedSearchResults(count, "Collection");
        default:
            return generateNamedSearchResults(count, "Data custodian");
    }
};

const generateSearchV1Response = (
    type: SearchCategory,
    overrides: Partial<SearchV1Response> = {}
): SearchV1Response => {
    const data = overrides.data ?? generateResultsForType(type, 2);
    const total = overrides.total ?? data.length;

    return {
        data,
        current_page: 1,
        last_page: 1,
        total,
        from: data.length ? 1 : 0,
        to: data.length,
        elastic_total: total,
        path: `http://localhost/api/v1/search/${type}`,
        aggregations: {},
        ...overrides,
    };
};

const generateArdcResults = (count: number): SearchResultARDC[] =>
    Array.from({ length: count }).map((_, index) => ({
        id: `ardc-${index + 1}`,
        slug: `ardc-dataset-${index + 1}`,
        display_title: `ARDC dataset ${index + 1}`,
        list_description: "Partner dataset",
    }));

const typesenseSearchFlags = {
    isExternalSourcesEnabled: true,
    isTypesenseSearchEnabled: true,
};

const generateSearchV2Response = (
    type: SearchCategory,
    overrides: Partial<SearchAggregationData> = {},
    hdruk: Partial<SearchAggregationProviderResult> = {}
): SearchAggregationData => {
    const hits = (hdruk.hits ??
        generateResultsForType(
            type,
            2
        )) as SearchAggregationProviderResult["hits"];

    return {
        query: "",
        type,
        results: {
            HDRUK: {
                provider_logo: null,
                about: null,
                hits,
                total: hits.length,
                aggregations: [],
                ids: hits.map(hit => hit._id),
                ...hdruk,
            },
        },
        ...overrides,
    };
};

export {
    generateArdcResults,
    generateDatasetSearchResults,
    generateResultsForType,
    generateSearchV1Response,
    generateSearchV2Response,
    typesenseSearchFlags,
};
export type { SearchV1Response };
