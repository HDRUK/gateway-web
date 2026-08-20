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
    showClearButton: true,
};

export {
    searchFilter as teamSearchFilter,
    defaultValues as teamSearchDefaultValues,
};
