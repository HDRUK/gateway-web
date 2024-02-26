import { inputComponents } from ".";

export const QUERY_FIELD = "query";
export const SORT_FIELD = "sort";

const sortByOptions = [
    {
        label: "Sort By Most Relevant",
        value: "score:asc",
    },
    {
        label: "Sort Alphabetically By Title (A-Z)",
        value: "title:asc",
    },
    {
        label: "Sort Alphabetically by title (Z-A)",
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

const searchFormConfig = {
    defaultValues: {
        sort: "score:asc",
        query: "",
    },
    sortByOptions,
    query: {
        name: QUERY_FIELD,
        placeholder: "Search titles",
    },
    sort: {
        sx: { minWidth: 270, m: 0 },
        component: inputComponents.Select,
        options: sortByOptions,
        name: SORT_FIELD,
    },
};

export default searchFormConfig;
