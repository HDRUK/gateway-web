import { inputComponents } from ".";

const defaultValues = {
    sortField: "updated",
    searchTitle: "",
    sortDirection: "desc",
};

const sortByOptions = [
    {
        label: "Sort By Date of Last Update",
        value: "updated",
        direction: "desc",
    },
    {
        label: "Sort By Date of Creation",
        value: "created",
        direction: "desc",
    },
    {
        label: "Sort By Title",
        value: "properties/summary/title",
        direction: "asc",
    },
    {
        label: "Sort By Publisher Name",
        value: "properties/summary/publisher/publisherName",
        direction: "asc",
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
    defaultValues as datasetSearchDefaultValues,
    sortByOptions,
};
