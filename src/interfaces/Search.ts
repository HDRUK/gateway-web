import {
    FILTER_DATA_USE_TITLES,
    FILTER_PUBLISHER_NAME,
} from "@/config/forms/filters";
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
    [FILTER_DATA_USE_TITLES]: string | undefined;
    [FILTER_PUBLISHER_NAME]: string | undefined;
    page: string;
    per_page: string;
    type?: string;
}
