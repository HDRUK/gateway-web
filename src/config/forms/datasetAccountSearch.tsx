import { inputComponents } from ".";

const defaultValues = {
    sortField: "updated",
    searchTitle: "",
};

const sortByOptions = [
    {
        label: "Sort By Date of Last Update",
        value: "updated",
        initialDirection: "desc",
    },
    {
        label: "Sort By Date of Creation",
        value: "created",
        initialDirection: "desc",
    },
    {
        label: "Sort By Title",
        value: "metadata.summary.title",
        initialDirection: "asc",
    },
    /*  Calum 12/02/2024 
    // - why would you sort by publisherName? 
    // - publisherName == team name
    // - publisherName will always be the same
    //   because this is the dataset page view
    {
        label: "Sort By Publisher Name",
        value: "metadata.summary.publisher.name",
        initialDirection: "asc",
    }, */
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
