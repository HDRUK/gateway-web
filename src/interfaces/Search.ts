import {
    FILTER_DATA_USE_TITLES,
    FILTER_PUBLISHER_NAME,
    FILTER_GEOGRAPHIC_LOCATION,
    FILTER_DATE_RANGE,
    FILTER_ORGANISATION_NAME,
    FILTER_DATA_SET_TITLES,
    FILTER_PUBLICATION_DATE,
    FILTER_SECTOR,
    FILTER_DATA_PROVIDER,
    FILTER_ACCESS_SERVICE,
    FILTER_PROGRAMMING_LANGUAGE,
    FILTER_TYPE_CATEGORY,
} from "@/config/forms/filters";
import { Metadata } from "./Dataset";
import { Bucket } from "./Filter";
import { Highlight } from "./HighlightDataset";
import { PaginationType } from "./Pagination";

export interface Aggregations {
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
    [FILTER_PROGRAMMING_LANGUAGE]: {
        buckets: Bucket[];
    };
    [FILTER_TYPE_CATEGORY]: {
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
}

export interface SearchResultDataUse extends SearchResultBase {
    highlight: {
        abstract: string;
        description: string;
    };
    team: {
        member_of: string;
        name: string;
    };
    projectTitle: string;
    organisationName: string;
    publisher: string;
    datasetTitles: string[];
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
    _id: string;
}

export interface SearchResultDataProvider extends SearchResultBase {
    name: string;
    _id: string;
}

export type SearchResult =
    | SearchResultDataset
    | SearchResultDataUse
    | SearchResultPublication
    | SearchResultCollection
    | SearchResultTool;

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
    [FILTER_GEOGRAPHIC_LOCATION]: string[] | undefined;
    [FILTER_DATE_RANGE]: string[] | undefined;
    [FILTER_ORGANISATION_NAME]: string[] | undefined;
    [FILTER_DATA_SET_TITLES]: string[] | undefined;
    [FILTER_PUBLICATION_DATE]: string[] | undefined;
    [FILTER_SECTOR]: string[] | undefined;
    [FILTER_DATA_PROVIDER]: string[] | undefined;
    [FILTER_ACCESS_SERVICE]: string[] | undefined;
    [FILTER_PROGRAMMING_LANGUAGE]: string[] | undefined;
    [FILTER_TYPE_CATEGORY]: string[] | undefined;
}

export type CountType = { [key: string]: number };
