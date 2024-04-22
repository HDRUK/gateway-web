import {
    FILTER_DATA_USE_TITLES,
    FILTER_PUBLISHER_NAME,
    FILTER_GEOGRAPHIC_LOCATION,
    FILTER_DATE_RANGE,
    FILTER_ORGANISATION_NAME,
    FILTER_DATA_SET_TITLES,
} from "@/config/forms/filters";
import { Metadata } from "./Dataset";
import { Bucket } from "./Filter";
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
    startDate: { value_as_string: string };
    endDate: { value_as_string: string };
}

export interface SearchPaginationType<T> extends PaginationType<T> {
    aggregations: Aggregations;
    path: string;
}

export interface SearchResultDataset {
    highlight: {
        abstract: string;
        description: string;
    };
    metadata: {
        metadata: Metadata;
    };
    _id: string;
}

export interface SearchResultDataUse {
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
    _id: string;
}

export interface SearchResultPublication {
    _id: string;
    abstract?: string;
    paper_title: string;
    authors?: string;
    journal_name?: string;
    year_of_publication?: string;
}

export type SearchResult =
    | SearchResultDataset
    | SearchResultDataUse
    | SearchResultPublication;

export interface SearchForm {
    query: string;
    sort: string;
}

export enum SearchCategory {
    COLLECTIONS = "collections",
    DATA_PROVIDERS = "dataProviders",
    DATASETS = "datasets",
    DATA_USE = "dur",
    TOOLS = "tools",
    PUBLICATIONS = "publications",
    DATA_ANALYSIS = "dataAnalysis",
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
    [FILTER_DATA_USE_TITLES]: string[] | undefined;
    [FILTER_PUBLISHER_NAME]: string[] | undefined;
    [FILTER_GEOGRAPHIC_LOCATION]: string[] | undefined;
    [FILTER_DATE_RANGE]: string[] | undefined;
    [FILTER_ORGANISATION_NAME]: string[] | undefined;
    [FILTER_DATA_SET_TITLES]: string[] | undefined;
}

export type CountType = { [key: string]: number };
