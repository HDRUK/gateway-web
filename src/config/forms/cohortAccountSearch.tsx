import { inputComponents } from ".";

const defaultValues = {
    search: "",
};

const searchFilter = {
    component: inputComponents.TextField,
    variant: "outlined",
    name: "search",
    placeholder: "Search by user name or organisation",
    label: "",
    showClearButton: true,
};

export {
    searchFilter as cohortSearchFilter,
    defaultValues as cohortSearchDefaultValues,
};
