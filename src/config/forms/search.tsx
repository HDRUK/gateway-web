import {
    SortAlphabeticalAscIcon,
    SortAlphabeticalDescIcon,
    SortDateAscIcon,
    SortDateDescIcon,
    SortRelevanceIcon,
} from "@/consts/icons";
import { inputComponents } from ".";

export const QUERY_FIELD = "query";
export const SORT_FIELD = "sort";
export const TYPE_FIELD = "type";
export const VIEW_FIELD = "view";
export const PAGE_FIELD = "page";
export const PMC_TYPE_FIELD = "pmc";
export const SOURCE_GAT = "GAT";

export const sortByOptionsDataset = [
    {
        label: "Sort by most relevant",
        value: "score:desc",
        icon: SortRelevanceIcon,
    },
    {
        label: "Sort alphabetically by title (A-Z)",
        value: "title:asc",
        icon: SortAlphabeticalAscIcon,
    },
    {
        label: "Sort alphabetically by title (Z-A)",
        value: "title:desc",
        icon: SortAlphabeticalDescIcon,
    },
    {
        label: "Sort by most recently updated",
        value: "updated_at:desc",
        icon: SortDateDescIcon,
    },
    {
        label: "Sort by least recently updated",
        value: "updated_at:asc",
        icon: SortDateAscIcon,
    },
];

export const sortByOptionsDataUse = [
    {
        label: "Sort by most relevant",
        value: "score:desc",
    },
    {
        label: "Sort alphabetically by project title (A-Z)",
        value: "projectTitle:asc",
    },
    {
        label: "Sort alphabetically by project title (Z-A)",
        value: "projectTitle:desc",
    },
    {
        label: "Sort by most recently updated",
        value: "updated_at:desc",
    },
    {
        label: "Sort by least recently updated",
        value: "updated_at:asc",
    },
];

export const sortByOptionsTool = [
    {
        label: "Sort by most relevant",
        value: "score:desc",
    },
    {
        label: "Sort alphabetically by name (A-Z)",
        value: "name:asc",
    },
    {
        label: "Sort alphabetically by name (Z-A)",
        value: "name:desc",
    },
    {
        label: "Sort by most recently updated",
        value: "updated_at:desc",
    },
    {
        label: "Sort by least recently updated",
        value: "updated_at:asc",
    },
];

export const sortByOptionsPublications = [
    {
        label: "Sort by most recent publication year",
        value: "year_of_publication:desc",
    },
    {
        label: "Sort by least recent publication year",
        value: "year_of_publication:asc",
    },
    {
        label: "Sort by most relevant",
        value: "score:desc",
    },
    {
        label: "Sort alphabetically by title (A-Z)",
        value: "title:asc",
    },
    {
        label: "Sort alphabetically by title (Z-A)",
        value: "title:desc",
    },
];

export const sortByOptionsCollections = [
    {
        label: "Sort by most relevant",
        value: "score:desc",
    },
    {
        label: "Sort alphabetically by name (A-Z)",
        value: "name:asc",
    },
    {
        label: "Sort alphabetically by name (Z-A)",
        value: "name:desc",
    },
    {
        label: "Sort by most recently updated",
        value: "updated_at:desc",
    },
    {
        label: "Sort by least recently updated",
        value: "updated_at:asc",
    },
];

export const sortByOptionsDataProviders = [
    {
        label: "Sort by most relevant",
        value: "score:desc",
    },
    {
        label: "Sort alphabetically by name (A-Z)",
        value: "name:asc",
    },
    {
        label: "Sort alphabetically by name (Z-A)",
        value: "name:desc",
    },
    {
        label: "Sort by most recently updated",
        value: "updated_at:desc",
    },
    {
        label: "Sort by least recently updated",
        value: "updated_at:asc",
    },
];

const searchFormConfig = {
    defaultValues: {
        sort: "score:desc",
        query: "",
        source: SOURCE_GAT,
    },
    query: {
        name: QUERY_FIELD,
        placeholder: "Search titles",
    },
    sort: {
        sx: { minWidth: 270, m: 0 },
        component: inputComponents.Select,
        name: SORT_FIELD,
        label: "",
        ariaLabel: "Sort by",
    },
};

export default searchFormConfig;
