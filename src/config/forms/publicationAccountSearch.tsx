import { inputComponents } from ".";

const defaultValues = {
    sortField: "updated_at",
    searchTitle: "",
};

const sortByOptions = [
    {
        label: "Sort By Date of Last Update",
        value: "updated_at",
        initialDirection: "desc",
    },
    {
        label: "Sort By Year of Publication",
        value: "year_of_publication",
        initialDirection: "desc",
    },
    {
        label: "Sort By Title",
        value: "paper_title",
        initialDirection: "asc",
    },
];

const searchFilter = {
    component: inputComponents.TextField,
    showClearButton: true,
    variant: "outlined",
    name: "searchTitle",
    placeholder: "Search publications by title",
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
    defaultValues as publicationSearchDefaultValues,
    sortByOptions,
};
