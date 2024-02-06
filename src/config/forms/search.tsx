import { inputComponents } from ".";

export const QUERY_FIELD = "query";
export const SORT_FIELD = "sort";
export const SORT_DIRECTION = "direction";

const sortByOptions = [
    {
        label: "Sort By Most Relevant",
        value: "score__",
        direction: "desc",
    },
    {
        label: "Sort Alphabetically By Title (A-Z)",
        value: "title__asc",
        direction: "asc",
    },
    {
        label: "Sort Alphabetically by title (Z-A)",
        value: "title__desc",
        direction: "desc",
    },
    {
        label: "Sort By Most Recently Updated",
        value: "created_at__asc",
        direction: "asc",
    },
    {
        label: "Sort By Least Recently Updated",
        value: "created_at__desc",
        direction: "desc",
    },
];

const searchFormConfig = {
    defaultValues: {
        sort: "score__",
        query: "",
    },
    sortByOptions,
    query: {
        name: QUERY_FIELD,
        placeholder: "Search titles",
    },
    sort: {
        sx: { minWidth: 270 },
        component: inputComponents.Select,
        options: sortByOptions,
        name: SORT_FIELD,
    },
};

export default searchFormConfig;
