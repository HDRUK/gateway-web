import { SearchCategory } from "@/interfaces/Search";
import * as Filters from "@/config/forms/filters";
import {
    sortByOptionsCollections,
    sortByOptionsDataCustodians,
    sortByOptionsDataUse,
    sortByOptionsDataset,
    sortByOptionsPublications,
    sortByOptionsTool,
} from "@/config/forms/search";

export const STATIC_FILTER_SOURCE = "source";
export const STATIC_FILTER_DATA_SOURCE = "dataSource";
export const GATEWAY_SOURCE_FIELD = "GAT";
export const EUROPE_PMC_SOURCE_FIELD = "FED";
export const SEARCH_PER_PAGE = "25";
export const PMC_DATASET_TYPE = "dataset";

export const ARRAY_FILTERS = [
    Filters.FILTER_DATA_USE_TITLES,
    Filters.FILTER_PUBLISHER_NAME,
    Filters.FILTER_COLLECTION_NAME,
    Filters.FILTER_COLLECTION_NAMES,
    Filters.FILTER_GEOGRAPHIC_LOCATION,
    Filters.FILTER_DATE_RANGE,
    Filters.FILTER_ORGANISATION_NAME,
    Filters.FILTER_DATA_SET_TITLES,
    Filters.FILTER_DATA_TYPE,
    Filters.FILTER_DATA_SUBTYPE,
    Filters.FILTER_PUBLICATION_DATE,
    Filters.FILTER_PUBLICATION_TYPE,
    Filters.FILTER_SECTOR,
    Filters.FILTER_DATA_PROVIDER,
    Filters.FILTER_DATA_CUSTODIAN_NETWORK,
    Filters.FILTER_ACCESS_SERVICE,
    Filters.FILTER_POPULATION_SIZE,
    Filters.FILTER_PROGRAMMING_LANGUAGE,
    Filters.FILTER_TYPE_CATEGORY,
    Filters.FILTER_CONTAINS_BIOSAMPLES,
    Filters.FILTER_MATERIAL_TYPE,
    Filters.FILTER_FORMAT_STANDARDS,
    Filters.FILTER_COHORT_DISCOVERY,
    Filters.FILTER_PUBLICATION_LINK_TYPE,
    Filters.FILTER_CATEGORY,
    Filters.FILTER_LICENSE,
] as const;

export const ALLOW_EMPTY_FILTERS: string[] = [
    Filters.FILTER_DATE_RANGE,
    Filters.FILTER_PUBLICATION_DATE,
];

export const RESULT_LIMIT = 100;

export const EXCLUDED_DOWNLOAD_CATEGORIES: string[] = [
    SearchCategory.PUBLICATIONS,
    SearchCategory.DATA_CUSTODIANS,
    SearchCategory.COLLECTIONS,
];

export const SEARCH_CATEGORY_TABS = [
    { value: SearchCategory.DATASETS, labelKey: "datasets" },
    { value: SearchCategory.DATA_USE, labelKey: "dataUse" },
    { value: SearchCategory.TOOLS, labelKey: "tools" },
    { value: SearchCategory.PUBLICATIONS, labelKey: "publications" },
    { value: SearchCategory.DATA_CUSTODIANS, labelKey: "dataCustodians" },
    { value: SearchCategory.COLLECTIONS, labelKey: "collections" },
] as const;

export const EXPLAINER_KEYS: Partial<Record<string, string>> = {
    [SearchCategory.PUBLICATIONS]: "searchExplainerPublications",
    [SearchCategory.DATA_USE]: "searchExplainerDataUse",
    [SearchCategory.COLLECTIONS]: "searchExplainerCollections",
    [SearchCategory.DATA_CUSTODIANS]: "searchExplainerDataCustodians",
    [SearchCategory.TOOLS]: "searchExplainerTools",
};

export const DEFAULT_EXPLAINER_KEY = "searchExplainerDatasets";

export const SORT_OPTIONS_BY_CATEGORY: Partial<
    Record<string, typeof sortByOptionsDataset>
> = {
    [SearchCategory.DATA_USE]: sortByOptionsDataUse,
    [SearchCategory.TOOLS]: sortByOptionsTool,
    [SearchCategory.PUBLICATIONS]: sortByOptionsPublications,
    [SearchCategory.COLLECTIONS]: sortByOptionsCollections,
    [SearchCategory.DATA_CUSTODIANS]: sortByOptionsDataCustodians,
};

export const DEFAULT_SORT_OPTIONS = sortByOptionsDataset;
