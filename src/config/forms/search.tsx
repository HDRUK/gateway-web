import { inputComponents } from ".";

export const QUERY_FIELD = "query";
export const SORT_FIELD = "sort";
export const TYPE_FIELD = "type";

export const sortByOptionsDataset = [
    {
        label: "Sort By Most Relevant",
        value: "score:desc",
    },
    {
        label: "Sort Alphabetically By Title (A-Z)",
        value: "title:asc",
    },
    {
        label: "Sort Alphabetically by Title (Z-A)",
        value: "title:desc",
    },
    {
        label: "Sort By Most Recently Updated",
        value: "created_at:asc",
    },
    {
        label: "Sort By Least Recently Updated",
        value: "created_at:desc",
    },
];

export const sortByOptionsDataUse = [
    {
        label: "Sort By Most Relevant",
        value: "score:desc",
    },
    {
        label: "Sort Alphabetically By Project Title (A-Z)",
        value: "projectTitle:asc",
    },
    {
        label: "Sort Alphabetically by Project Title (Z-A)",
        value: "projectTitle:desc",
    },
    {
        label: "Sort By Most Recently Updated",
        value: "created_at:asc",
    },
    {
        label: "Sort By Least Recently Updated",
        value: "created_at:desc",
    },
];

const searchFormConfig = {
    defaultValues: {
        sort: "score:desc",
        query: "",
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
    },
};

export default searchFormConfig;
