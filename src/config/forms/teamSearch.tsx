import { inputComponents } from ".";

const defaultValues = {
    search: "",
};

const searchFilter = {
    component: inputComponents.TextField,
    variant: "outlined",
    name: "search",
    placeholder: "Search by team name",
    label: "",
    inputProps: { "aria-label": "Search by team name" },
    showClearButton: true,
};

export {
    searchFilter as teamSearchFilter,
    defaultValues as teamSearchDefaultValues,
};
