import {
    FILTER_DATA_USE_TITLES,
    FILTER_PUBLISHER_NAME,
    FILTER_COLLECTION_NAME,
    FILTER_COLLECTION_NAMES,
    FILTER_GEOGRAPHIC_LOCATION,
    FILTER_DATE_RANGE,
    FILTER_ORGANISATION_NAME,
    FILTER_DATA_SET_TITLES,
    FILTER_DATA_TYPE,
    FILTER_DATA_SUBTYPE,
    FILTER_PUBLICATION_DATE,
    FILTER_PUBLICATION_TYPE,
    FILTER_SECTOR,
    FILTER_DATA_PROVIDER,
    FILTER_DATA_CUSTODIAN_NETWORK,
    FILTER_ACCESS_SERVICE,
    FILTER_POPULATION_SIZE,
    FILTER_PROGRAMMING_LANGUAGE,
    FILTER_TYPE_CATEGORY,
    FILTER_CONTAINS_TISSUE,
    FILTER_MATERIAL_TYPE,
} from "@/config/forms/filters";
import { PMC_TYPE_FIELD } from "@/config/forms/search";
import { Metadata } from "./Dataset";
import { Bucket } from "./Filter";
import { Highlight } from "./HighlightDataset";
import { PaginationType } from "./Pagination";
import { Team } from "./Team";

export interface Aggregations {
    [FILTER_DATA_TYPE]: {
        buckets: Bucket[];
    };
    [FILTER_DATA_SUBTYPE]: {
        buckets: Bucket[];
    };
    [FILTER_COLLECTION_NAME]: {
        buckets: Bucket[];
    };
    [FILTER_COLLECTION_NAMES]: {
        buckets: Bucket[];
    };
    [FILTER_DATA_USE_TITLES]: {
        buckets: Bucket[];
    };
    [FILTER_GEOGRAPHIC_LOCATION]: {
        buckets: Bucket[];
    };
    [FILTER_PUBLISHER_NAME]: {
        buckets: Bucket[];
    };
    [FILTER_SECTOR]: {
        buckets: Bucket[];
    };
    [FILTER_ACCESS_SERVICE]: {
        buckets: Bucket[];
    };
    [FILTER_POPULATION_SIZE]: {
        buckets: Bucket[];
    };
    [FILTER_PROGRAMMING_LANGUAGE]: {
        buckets: Bucket[];
    };
    [FILTER_TYPE_CATEGORY]: {
        buckets: Bucket[];
    };
    [FILTER_MATERIAL_TYPE]: {
        buckets: Bucket[];
    };
    [FILTER_PUBLICATION_TYPE]: {
        buckets: Bucket[];
    };
    [FILTER_DATA_CUSTODIAN_NETWORK]: {
        buckets: Bucket[];
    };
    startDate: { value_as_string: string };
    endDate: { value_as_string: string };
}

export interface SearchPaginationType<T> extends PaginationType<T> {
    aggregations: Aggregations;
    path: string;
    elastic_total: number;
}
interface SearchResultBase {
    _id: string;
}

export interface SearchResultDataset extends SearchResultBase {
    highlight: Highlight;
    metadata: Metadata;
    team: {
        id: number;
        member_of: string;
        name: string;
        is_question_bank: boolean;
        is_dar: boolean;
        dar_modal_header: string | null;
        dar_modal_content: string | null;
        dar_modal_footer: string | null;
    };
}

export interface SearchResultDataUse extends SearchResultBase {
    highlight: {
        abstract: string;
        description: string;
    };
    team: {
        id: number;
        member_of: string;
        name: string;
    };
    projectTitle: string;
    organisationName: string;
    publisher: string;
    datasetTitles: string[];
    datasetIds: number[];
    non_gateway_datasets: string[];
}

export interface SearchResultPublication extends SearchResultBase {
    abstract?: string;
    paper_title: string;
    authors?: string;
    journal_name?: string;
    year_of_publication?: string;
    full_text_url: string;
    url: string;
}

export interface SearchResultTool extends SearchResultBase {
    name: string;
    description: string;
    created_at: string;
    tags?: string[];
    uploader?: string;
    team_name?: string;
    type_category?: string[];
    license?: string;
    programming_language?: string[];
    programming_package?: string[];
    datasets?: string[];
    category?: string;
}

export interface SearchResultCollection extends SearchResultBase {
    name: string;
    image_link?: string;
    team: Team | null;
}

export interface SearchResultDataProvider extends SearchResultBase {
    name: string;
    team_logo?: string;
}

export interface SearchResultDataCustodianCol extends SearchResultBase {
    id: number;
    name: string;
    img_url: string;
}

export type SearchResult =
    | SearchResultDataset
    | SearchResultDataUse
    | SearchResultPublication
    | SearchResultCollection
    | SearchResultTool
    | SearchResultDataProvider
    | SearchResultDataCustodianCol;

export interface SearchForm {
    query: string;
    sort: string;
}

export enum SearchCategory {
    COLLECTIONS = "collections",
    DATA_PROVIDERS = "data_providers",
    DATASETS = "datasets",
    DATA_USE = "dur",
    TOOLS = "tools",
    PUBLICATIONS = "publications",
}

export interface SavedSearchPayload {
    name: string;
    search_term: string;
    sort_order: string;
    filters: {
        id: number;
        terms: string[];
    }[];
    enabled: boolean;
}

export interface SavedSearchFilterWithPivot {
    id: number;
    keys: string;
    pivot: {
        terms: string;
    };
}

export interface SavedSearchWithPivot {
    id: number;
    name: string;
    search_endpoint: string;
    search_term: string;
    sort_order: string;
    filters: SavedSearchFilterWithPivot[];
    enabled: boolean;
    updated_at: string;
    created_at: string;
}

export enum ViewType {
    TABLE = "table",
    LIST = "list",
}

export interface SearchQueryParams {
    query: string | undefined;
    sort: string | undefined;
    page: string;
    per_page: string;
    type: SearchCategory;
    source: string | undefined;
    [FILTER_DATA_USE_TITLES]: string[] | undefined;
    [FILTER_PUBLISHER_NAME]: string[] | undefined;
    [FILTER_COLLECTION_NAME]: string[] | undefined;
    [FILTER_COLLECTION_NAMES]: string[] | undefined;
    [FILTER_GEOGRAPHIC_LOCATION]: string[] | undefined;
    [FILTER_DATE_RANGE]: string[] | undefined;
    [FILTER_ORGANISATION_NAME]: string[] | undefined;
    [FILTER_DATA_SET_TITLES]: string[] | undefined;
    [FILTER_DATA_TYPE]: string[] | undefined;
    [FILTER_DATA_SUBTYPE]: string[] | undefined;
    [FILTER_PUBLICATION_DATE]: string[] | undefined;
    [FILTER_PUBLICATION_TYPE]: string[] | undefined;
    [FILTER_SECTOR]: string[] | undefined;
    [FILTER_DATA_PROVIDER]: string[] | undefined;
    [FILTER_DATA_CUSTODIAN_NETWORK]: string[] | undefined;
    [FILTER_ACCESS_SERVICE]: string[] | undefined;
    [FILTER_POPULATION_SIZE]: string[] | undefined;
    [FILTER_PROGRAMMING_LANGUAGE]: string[] | undefined;
    [FILTER_TYPE_CATEGORY]: string[] | undefined;
    [FILTER_CONTAINS_TISSUE]: string[] | undefined;
    [FILTER_MATERIAL_TYPE]: string[] | undefined;
    [PMC_TYPE_FIELD]: string | undefined;
}

export type CountType = { [key: string]: number };
