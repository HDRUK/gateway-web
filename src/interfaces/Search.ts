import { Metadata } from "./Dataset";

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
    filters: string | undefined;
    page: string;
    per_page: string;
    type?: string;
}
