import { inputComponents } from ".";

const defaultValues = {
    sortField: "updated_at",
    searchTitle: "",
};

const sortByOptions = [
    {
        label: "Sort By date of latest activity",
        value: "updated_at",
        initialDirection: "desc",
    },
    {
        label: "Sort alphabetically by title",
        value: "project_title",
        initialDirection: "asc",
    },
    {
        label: "Sort by project start date",
        value: "project_start_date",
        initialDirection: "desc",
    },
];

const searchFilter = {
    component: inputComponents.TextField,
    showClearButton: true,
    variant: "outlined",
    name: "searchTitle",
    placeholder: "Search titles",
    label: "",
};

const sortField = {
    sx: { minWidth: 220 },
    component: inputComponents.Select,
    label: "",
    options: sortByOptions,
    name: "sortField",
};

const toggleDirection = {
    component: inputComponents.ToggleDirection,
    label: "",
    name: "sortDirection",
};

export {
    toggleDirection,
    sortField,
    searchFilter,
    defaultValues as dataUseSearchDefaultValues,
    sortByOptions,
};
