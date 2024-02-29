import {
    FILTER_DATA_USE_TITLES,
    FILTER_PUBLISHER_NAME,
    FILTER_GEOGRAPHIC_LOCATION,
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
}

export interface SearchPaginationType<T> extends PaginationType<T> {
    aggregations: Aggregations;
}

export interface SearchResult {
    highlight: {
        abstract: string;
        description: string;
    };
    metadata: {
        metadata: Metadata;
    };
    _id: string;
}

export interface SearchForm {
    query: string;
    sort: string;
}

export enum SearchCategory {
    COLLECTIONS = "collections",
    DATASETS = "datasets",
    DATA_USE = "dur",
    TOOLS = "tools",
}

export interface SearchQueryParams {
    query: string | undefined;
    sort: string | undefined;
    [FILTER_DATA_USE_TITLES]: string[] | undefined;
    [FILTER_PUBLISHER_NAME]: string[] | undefined;
    [FILTER_GEOGRAPHIC_LOCATION]: string[] | undefined;
    page: string;
    per_page: string;
    type?: string;
}
