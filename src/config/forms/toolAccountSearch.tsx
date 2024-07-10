import { inputComponents } from ".";

const defaultValues = {
    sortField: "updated_at",
    searchTitle: "",
};

const sortByOptions = [
    {
        label: "Sort By Date of Last Activity",
        value: "updated_at",
        initialDirection: "desc",
    },
    {
        label: "Sort By Date of Creation",
        value: "created_at",
        initialDirection: "desc",
    },
    {
        label: "Sort by Title",
        value: "name",
        initialDirection: "asc",
    },
];

const searchFilter = {
    component: inputComponents.TextField,
    showClearButton: true,
    variant: "outlined",
    name: "searchTitle",
    placeholder: "Search analysis script, tools and software titles",
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
    defaultValues as searchDefaultValues,
    sortByOptions,
};
